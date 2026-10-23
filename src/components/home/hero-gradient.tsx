"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * WebGL2 animated gradient hero backdrop, modelled on the DeepSeek Harness
 * hero. Two shader passes:
 *  1. a ping-pong "flowmap" that accumulates pointer position + velocity
 *     (with decay) into a texture;
 *  2. a render pass that blends a multi-stop gradient with value noise, a
 *     swirl loop and sinusoidal distortion, then lets the flowmap locally
 *     distort the field and add a glow that follows the cursor.
 *
 * Purely decorative. Falls back to a static CSS gradient when WebGL is
 * unavailable or the user prefers reduced motion.
 */

const VERT = `#version 300 es
in vec4 a_position;
out vec2 vUv;
void main() {
  vUv = a_position.xy * 0.5 + 0.5;
  gl_Position = a_position;
}
`;

// Ping-pong flowmap: r = influence, gb = encoded velocity.
const FLOW_FRAG = `#version 300 es
precision mediump float;
in vec2 vUv;
uniform sampler2D u_prev;
uniform vec2 u_mouse;
uniform vec2 u_velocity;
uniform float u_brushRadius;
uniform float u_brushStrength;
uniform float u_decay;
out vec4 fragColor;

void main() {
  vec4 prev = texture(u_prev, vUv);

  prev.r *= u_decay;
  prev.gb = mix(vec2(0.5), prev.gb, u_decay);

  float dist = distance(vUv, u_mouse);

  float influence = exp(-dist * dist / (u_brushRadius * u_brushRadius * 0.5));
  influence = max(0.0, influence - 0.01);

  float speed = length(u_velocity);
  float presenceStrength = u_brushStrength * 0.3;
  float velBonus = min(speed * 3.0, 0.7) * u_brushStrength;
  float totalStrength = presenceStrength + velBonus;

  prev.r = max(prev.r, influence * totalStrength);
  float blendAmt = influence * min(totalStrength, 0.4) * 0.3;
  prev.g = mix(prev.g, clamp(u_velocity.x * 2.0 + 0.5, 0.0, 1.0), blendAmt);
  prev.b = mix(prev.b, clamp(u_velocity.y * 2.0 + 0.5, 0.0, 1.0), blendAmt);

  fragColor = prev;
}
`;

const RENDER_FRAG = `#version 300 es
precision mediump float;
in vec2 vUv;
uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1, u_color2, u_color3, u_color4, u_color5;
uniform float u_colorCount;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;
uniform vec2 u_offset;
uniform sampler2D u_flowmap;
uniform float u_distortBoost;
uniform float u_noiseBoost;
uniform float u_swirlBoost;
uniform float u_glowIntensity;
uniform vec3 u_glowColor1;
uniform vec3 u_glowColor2;
uniform vec3 u_glowColor3;
out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) { return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv; }
float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
float noise(vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st);
  float a = random(i), b = random(i + vec2(1,0)), c = random(i + vec2(0,1)), d = random(i + vec2(1,1));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

vec3 blend_multi(float mixer, float softness) {
  float edge = 1.0 - softness;
  float n = u_colorCount;
  vec3 col = u_color1.rgb;
  if (n > 1.5) { col = mix(col, u_color2.rgb, smoothstep(0.0 + 0.2*edge, 1.0/(n-0.5) - 0.2*edge, mixer)); }
  if (n > 2.5) { col = mix(col, u_color3.rgb, smoothstep(1.0/(n-0.5) + 0.1*edge, 2.0/(n-0.5) - 0.1*edge, mixer)); }
  if (n > 3.5) { col = mix(col, u_color4.rgb, smoothstep(2.0/(n-0.5) + 0.1*edge, 3.0/(n-0.5) - 0.1*edge, mixer)); }
  if (n > 4.5) { col = mix(col, u_color5.rgb, smoothstep(3.0/(n-0.5) + 0.1*edge, 4.0/(n-0.5) - 0.1*edge, mixer)); }
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = .35 * u_time;
  float ns = .0005 + .006 * u_scale;
  uv -= .5; uv *= (ns * u_resolution); uv = rotate(uv, u_rotation * .5 * PI);
  uv /= u_pixelRatio; uv += .5; uv += u_offset;

  vec2 fragUV = gl_FragCoord.xy / u_resolution.xy;
  vec4 flow = texture(u_flowmap, fragUV);
  float influence = flow.r;
  vec2 flowDir = (flow.gb - 0.5) * 2.0;

  float n1 = noise(uv + t), n2 = noise(uv*2. - t);
  float angle = n1 * TWO_PI;

  float totalDistortion = u_distortion + influence * u_distortBoost;
  uv.x += 4. * totalDistortion * n2 * cos(angle);
  uv.y += 4. * totalDistortion * n2 * sin(angle);

  uv += flowDir * influence * 0.15;

  if (influence > 0.001) {
    float localNoise = noise(uv * 2.0 + t * 1.5);
    uv += influence * u_noiseBoost * vec2(cos(localNoise * TWO_PI), sin(localNoise * TWO_PI));
  }

  float iters = ceil(clamp(u_swirlIterations, 1., 30.));
  float swirlAmt = clamp(u_swirl, 0., 2.) + influence * u_swirlBoost;
  for (float i = 1.; i <= 30.0; i++) {
    if (i > iters) break;
    uv.x += swirlAmt / i * cos(t + i*1.5*uv.y);
    uv.y += swirlAmt / i * cos(t + i*1.*uv.x);
  }

  float proportion = clamp(u_proportion, 0., 1.);
  vec2 cuv = uv * (.5 + 3.5 * u_shapeScale);
  float shape = .5 + .5 * sin(cuv.x) * cos(cuv.y);
  float mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  vec3 col = blend_multi(mixer, clamp(u_softness, 0., 1.));

  // Mouse proximity color shift: 3-color glow
  float glow = smoothstep(0.0, 0.8, influence);
  float glowNoise = noise(uv * 3.0 + u_time * 0.1);
  float glowDist = smoothstep(0.0, 1.0, influence);
  vec3 glowMix = mix(u_glowColor3, u_glowColor2, glowDist);
  glowMix = mix(glowMix, u_glowColor1, glowDist * glowNoise);
  col = mix(col, glowMix, glow * u_glowIntensity);

  fragColor = vec4(col, 1.0);
}
`;

type GL = WebGL2RenderingContext;

function hexToVec4(hex: string, alpha = 1): [number, number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, alpha];
}
function hexToVec3(hex: string): [number, number, number] {
  const [r, g, b] = hexToVec4(hex);
  return [r, g, b];
}

function compile(gl: GL, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s;
  console.error("Shader:", gl.getShaderInfoLog(s));
  gl.deleteShader(s);
  return null;
}

function program(gl: GL, fragSrc: string): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (gl.getProgramParameter(p, gl.LINK_STATUS)) return p;
  console.error("Link:", gl.getProgramInfoLog(p));
  return null;
}

export function HeroGradient({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let contextLost = false;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    const renderProg = program(gl, RENDER_FRAG);
    const flowProg = program(gl, FLOW_FRAG);
    if (!renderProg || !flowProg) return;

    // Fullscreen triangle pair.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    function bindAttrib(prog: WebGLProgram) {
      const loc = gl!.getAttribLocation(prog, "a_position");
      gl!.enableVertexAttribArray(loc);
      gl!.vertexAttribPointer(loc, 2, gl!.FLOAT, false, 0, 0);
    }

    // Uniform locations.
    const U = (prog: WebGLProgram, name: string) =>
      gl.getUniformLocation(prog, name);
    const ru = {
      time: U(renderProg, "u_time"),
      pixelRatio: U(renderProg, "u_pixelRatio"),
      resolution: U(renderProg, "u_resolution"),
      scale: U(renderProg, "u_scale"),
      rotation: U(renderProg, "u_rotation"),
      color1: U(renderProg, "u_color1"),
      color2: U(renderProg, "u_color2"),
      color3: U(renderProg, "u_color3"),
      color4: U(renderProg, "u_color4"),
      color5: U(renderProg, "u_color5"),
      colorCount: U(renderProg, "u_colorCount"),
      proportion: U(renderProg, "u_proportion"),
      softness: U(renderProg, "u_softness"),
      shapeScale: U(renderProg, "u_shapeScale"),
      distortion: U(renderProg, "u_distortion"),
      swirl: U(renderProg, "u_swirl"),
      swirlIterations: U(renderProg, "u_swirlIterations"),
      offset: U(renderProg, "u_offset"),
      flowmap: U(renderProg, "u_flowmap"),
      distortBoost: U(renderProg, "u_distortBoost"),
      noiseBoost: U(renderProg, "u_noiseBoost"),
      swirlBoost: U(renderProg, "u_swirlBoost"),
      glowIntensity: U(renderProg, "u_glowIntensity"),
      glowColor1: U(renderProg, "u_glowColor1"),
      glowColor2: U(renderProg, "u_glowColor2"),
      glowColor3: U(renderProg, "u_glowColor3"),
    };
    const fu = {
      prev: U(flowProg, "u_prev"),
      mouse: U(flowProg, "u_mouse"),
      velocity: U(flowProg, "u_velocity"),
      brushRadius: U(flowProg, "u_brushRadius"),
      brushStrength: U(flowProg, "u_brushStrength"),
      decay: U(flowProg, "u_decay"),
    };

    // --- Ping-pong flowmap textures (small, quarter-res is plenty) ---
    function makeTarget(w: number, h: number) {
      const tex = gl!.createTexture();
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texImage2D(
        gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null,
      );
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      const fbo = gl!.createFramebuffer();
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0,
      );
      return { tex, fbo };
    }

    const cfg = {
      // DeepSeek harness gradient palette (deep navy -> blues).
      color1: hexToVec4("#1A3870"),
      color2: hexToVec4("#2D5F9E"),
      color3: hexToVec4("#4A8AC4"),
      color4: hexToVec4("#2E58A4"),
      color5: hexToVec4("#1f3873"),
      colorCount: 5,
      scale: 0.55,
      rotation: 0.12,
      proportion: 0.5,
      softness: 0.75,
      shapeScale: 0.6,
      distortion: 0.09,
      swirl: 0.2,
      swirlIterations: 8,
      offset: [0, 0] as [number, number],
      distortBoost: 0.4,
      noiseBoost: 0.18,
      swirlBoost: 0.35,
      glowIntensity: 0.5,
      glowColor1: hexToVec3("#5a8dd9"),
      glowColor2: hexToVec3("#4A8AC4"),
      glowColor3: hexToVec3("#1A3870"),
      brushRadius: 0.22,
      brushStrength: 0.8,
      decay: 0.94,
    };

    let fw = 4, fh = 4;
    let front = makeTarget(fw, fh);
    let back = makeTarget(fw, fh);

    const pointer = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, vx: 0, vy: 0, active: false };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = canvas!.clientWidth, h = canvas!.clientHeight;
      const W = Math.max(1, Math.floor(w * dpr));
      const H = Math.max(1, Math.floor(h * dpr));
      if (canvas!.width !== W || canvas!.height !== H) {
        canvas!.width = W; canvas!.height = H;
      }
      const nfw = Math.max(4, Math.floor(W / 4));
      const nfh = Math.max(4, Math.floor(H / 4));
      if (nfw !== fw || nfh !== fh) {
        fw = nfw; fh = nfh;
        front = makeTarget(fw, fh);
        back = makeTarget(fw, fh);
      }
    }

    function onPointerMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height; // GL origin bottom-left
      pointer.vx = x - pointer.px;
      pointer.vy = y - pointer.py;
      pointer.px = pointer.x = x;
      pointer.py = pointer.y = y;
      pointer.active = true;
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize);
    resize();

    let raf = 0;
    const start = performance.now();

    function frame() {
      if (disposed || contextLost) return;
      raf = requestAnimationFrame(frame);
      const t = (performance.now() - start) / 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

      // 1) Update flowmap into `back`, reading from `front`.
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, back.fbo);
      gl!.viewport(0, 0, fw, fh);
      gl!.useProgram(flowProg!);
      bindAttrib(flowProg!);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, front.tex);
      gl!.uniform1i(fu.prev, 0);
      gl!.uniform2f(fu.mouse, pointer.x, pointer.y);
      gl!.uniform2f(fu.velocity, pointer.vx, pointer.vy);
      gl!.uniform1f(fu.brushRadius, cfg.brushRadius);
      gl!.uniform1f(fu.brushStrength, pointer.active ? cfg.brushStrength : 0);
      gl!.uniform1f(fu.decay, cfg.decay);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      // swap
      const tmp = front; front = back; back = tmp;
      // ease velocity back toward zero
      pointer.vx *= 0.9; pointer.vy *= 0.9;

      // 2) Render gradient to canvas.
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.useProgram(renderProg!);
      bindAttrib(renderProg!);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, front.tex);
      gl!.uniform1i(ru.flowmap, 0);
      gl!.uniform1f(ru.time, t);
      gl!.uniform1f(ru.pixelRatio, dpr);
      gl!.uniform2f(ru.resolution, canvas!.width, canvas!.height);
      gl!.uniform1f(ru.scale, cfg.scale);
      gl!.uniform1f(ru.rotation, cfg.rotation);
      gl!.uniform4fv(ru.color1, cfg.color1);
      gl!.uniform4fv(ru.color2, cfg.color2);
      gl!.uniform4fv(ru.color3, cfg.color3);
      gl!.uniform4fv(ru.color4, cfg.color4);
      gl!.uniform4fv(ru.color5, cfg.color5);
      gl!.uniform1f(ru.colorCount, cfg.colorCount);
      gl!.uniform1f(ru.proportion, cfg.proportion);
      gl!.uniform1f(ru.softness, cfg.softness);
      gl!.uniform1f(ru.shapeScale, cfg.shapeScale);
      gl!.uniform1f(ru.distortion, cfg.distortion);
      gl!.uniform1f(ru.swirl, cfg.swirl);
      gl!.uniform1f(ru.swirlIterations, cfg.swirlIterations);
      gl!.uniform2f(ru.offset, cfg.offset[0], cfg.offset[1]);
      gl!.uniform1f(ru.distortBoost, cfg.distortBoost);
      gl!.uniform1f(ru.noiseBoost, cfg.noiseBoost);
      gl!.uniform1f(ru.swirlBoost, cfg.swirlBoost);
      gl!.uniform1f(ru.glowIntensity, cfg.glowIntensity);
      gl!.uniform3fv(ru.glowColor1, cfg.glowColor1);
      gl!.uniform3fv(ru.glowColor2, cfg.glowColor2);
      gl!.uniform3fv(ru.glowColor3, cfg.glowColor3);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      // Do NOT force-lose the context here: React StrictMode double-mounts,
      // and losing the context on the first unmount would break the canvas
      // for the surviving mount.
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    // Static stand-in: layered radial gradients in the same palette.
    return (
      <div
        aria-hidden
        className={className}
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 30% 30%, #2D5F9E 0%, transparent 70%)," +
            "radial-gradient(ellipse 55% 55% at 70% 45%, #4A8AC4 0%, transparent 70%)," +
            "radial-gradient(ellipse 70% 70% at 50% 70%, #1A3870 0%, transparent 70%)," +
            "#000",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
