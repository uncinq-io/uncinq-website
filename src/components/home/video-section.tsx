"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

const VIDEO_ID = "v2Mk-Hh3es8";
const THUMB = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

/**
 * DeepSeek "Customize your DeepSeek Harness"-style video section: a centred
 * heading above a full-width, rounded aspect-video player. Shows the YouTube
 * thumbnail with a play button; clicking swaps in the YouTube embed so the
 * video stays lightweight until requested.
 */
export function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <Section id="video" className="text-center">
      <Reveal className="mx-auto max-w-3xl">
        <span className="eyebrow justify-center">See it in action</span>
        <h2 className="mt-5 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Watch what we build
        </h2>
      </Reveal>

      <Reveal delay={0.12} className="mt-12">
        <div className="group relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-[0_40px_120px_-40px_rgba(74,138,196,0.35)]">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
              title="Uncinq — product video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play video"
              className="absolute inset-0 grid h-full w-full place-items-center"
            >
              {/* Thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={THUMB}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              {/* Dim + vignette so the play control reads on any frame */}
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"
              />
              {/* Play button */}
              <span
                className={
                  "relative grid h-20 w-20 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:scale-105" +
                  (reduceMotion ? "" : " motion-safe:group-hover:scale-110")
                }
              >
                <Play size={28} className="ml-1 fill-current" />
              </span>
            </button>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
