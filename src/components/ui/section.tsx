import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Reveal } from "@/components/motion/reveal";

export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-24 lg:py-32", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/**
 * Eyebrow + title + optional lede. Kept as one component so the vertical
 * rhythm above every section stays identical across pages.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className={cn("eyebrow", align === "center" && "justify-center")}>
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-5 text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {lede ? (
        <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
