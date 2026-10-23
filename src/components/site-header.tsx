"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { navigation, site } from "@/lib/site";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-quint)]",
        scrolled || menuOpen
          ? "border-b border-white/10 bg-ink-950/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-500",
            scrolled ? "h-16" : "h-20 lg:h-24",
          )}
        >
          <Link href="/" aria-label={`${site.name} — home`}>
            <Logo
              priority
              className={cn(
                "transition-all duration-500",
                scrolled ? "h-6" : "h-7",
              )}
            />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {navigation.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm transition-colors duration-200",
                    active ? "text-white" : "text-ink-300 hover:text-white",
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-accent-500"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink
              href="/contact"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Start a project
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-ink-100 lg:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <Container className="pb-8 pt-2">
              <ul className="flex flex-col">
                {navigation.map((item) => (
                  <li key={item.href} className="border-b border-white/10">
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-4 font-display text-2xl text-ink-100"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/contact"
                size="lg"
                onClick={() => setMenuOpen(false)}
                className="mt-8 w-full"
              >
                Start a project
              </ButtonLink>
            </Container>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
