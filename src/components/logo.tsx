import Image from "next/image";
import logoSrc from "../../public/uncinq-logo-1.png";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Statically imported so Next infers the intrinsic size and emits a correctly
 * sized, optimised asset. Height is set in CSS; width follows the ratio.
 */
export function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={logoSrc}
      alt={site.name}
      priority={priority}
      sizes="200px"
      className={cn("h-7 w-auto", className)}
    />
  );
}
