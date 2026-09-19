"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "../../lib/utils.js";

export interface NavItem {
    label: string;
    href: string;
}

export interface SpotlightNavbarProps {
    items?: NavItem[];
    className?: string;
    onItemClick?: (item: NavItem, index: number) => void;
    defaultActiveIndex?: number;
}

export function SpotlightNavbar({
    items = [
        { label: "Home", href: "#home" },
        { label: "About", href: "#about" },
        { label: "Events", href: "#events" },
        { label: "Sponsors", href: "#sponsors" },
        { label: "Pricing", href: "#pricing" },
    ],
    className,
    onItemClick,
    defaultActiveIndex = 0,
}: SpotlightNavbarProps) {
    const navRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
    const [hoverX, setHoverX] = useState<number | null>(null);
    const [_isDark, setIsDark] = useState(false);

    // Refs for the "light" positions so we can animate them imperatively
    const spotlightX = useRef(0);
    const ambienceX = useRef(0);

    // Animation controllers to prevent animation pile-up on mobile
    const spotlightAnimRef = useRef<{ stop: () => void } | null>(null);
    const ambienceAnimRef = useRef<{ stop: () => void } | null>(null);

    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!navRef.current) return;
        const nav = navRef.current;

        const updateSpotlight = (clientX: number) => {
            const rect = nav.getBoundingClientRect();
            const x = clientX - rect.left;
            setHoverX(x);
            spotlightX.current = x;
            nav.style.setProperty("--spotlight-x", `${x}px`);
        };

        const handleMouseMove = (e: MouseEvent) => {
            updateSpotlight(e.clientX);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                updateSpotlight(e.touches[0].clientX);
            }
        };

        const handleMouseLeave = () => {
            setHoverX(null);
            const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
            if (activeItem) {
                const navRect = nav.getBoundingClientRect();
                const itemRect = activeItem.getBoundingClientRect();
                const targetX = itemRect.left - navRect.left + itemRect.width / 2;

                spotlightAnimRef.current?.stop();
                spotlightAnimRef.current = animate(spotlightX.current, targetX, {
                    type: "spring",
                    stiffness: 240,
                    damping: 24,
                    onUpdate: (v) => {
                        spotlightX.current = v;
                        nav.style.setProperty("--spotlight-x", `${v}px`);
                    }
                });
            }
        };

        nav.addEventListener("mousemove", handleMouseMove, { passive: true });
        nav.addEventListener("mouseleave", handleMouseLeave, { passive: true });
        nav.addEventListener("touchmove", handleTouchMove, { passive: true });
        nav.addEventListener("touchend", handleMouseLeave, { passive: true });

        return () => {
            nav.removeEventListener("mousemove", handleMouseMove);
            nav.removeEventListener("mouseleave", handleMouseLeave);
            nav.removeEventListener("touchmove", handleTouchMove);
            nav.removeEventListener("touchend", handleMouseLeave);
            spotlightAnimRef.current?.stop();
        };
    }, [activeIndex]);

    // Handle the "Ambience" (Active Item) Movement & Auto-scroll into view on mobile
    useEffect(() => {
        if (!navRef.current) return;
        const nav = navRef.current;
        const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement | null;

        if (activeItem) {
            // Smoothly auto-center active item on mobile horizontally
            activeItem.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

            const navRect = nav.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();
            const targetX = itemRect.left - navRect.left + itemRect.width / 2;

            ambienceAnimRef.current?.stop();
            ambienceAnimRef.current = animate(ambienceX.current, targetX, {
                type: "spring",
                stiffness: 240,
                damping: 24,
                onUpdate: (v) => {
                    ambienceX.current = v;
                    nav.style.setProperty("--ambience-x", `${v}px`);
                },
            });
        }

        return () => {
            ambienceAnimRef.current?.stop();
        };
    }, [activeIndex]);

    // Sync activeIndex if defaultActiveIndex prop updates
    useEffect(() => {
        setActiveIndex(defaultActiveIndex);
    }, [defaultActiveIndex]);

    const handleItemClick = (item: NavItem, index: number) => {
        setActiveIndex(index);
        onItemClick?.(item, index);
    };

    return (
        <div className={cn("relative flex justify-center w-full max-w-full overflow-hidden", className)}>
            {/* Scrollable Container for Mobile Viewports */}
            <div className="w-full max-w-full overflow-x-auto no-scrollbar scroll-smooth flex justify-start sm:justify-center px-2 py-0.5 overscroll-contain">
                <nav
                    ref={navRef}
                    className={cn(
                        "spotlight-nav spotlight-nav-bg glass-border spotlight-nav-shadow",
                        "relative h-11 rounded-full transition-all duration-300 overflow-hidden shrink-0 inline-flex"
                    )}
                >
                    {/* Content */}
                    <ul className="relative flex items-center h-full px-1.5 gap-0.5 z-[10] whitespace-nowrap">
                        {items.map((item, idx) => (
                            <li key={idx} className="relative h-full flex items-center justify-center">
                                <a
                                    href={item.href}
                                    data-index={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleItemClick(item, idx);
                                    }}
                                    className={cn(
                                        "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-150 rounded-full whitespace-nowrap cursor-pointer select-none touch-manipulation",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/30",
                                        // Active vs Inactive Text
                                        activeIndex === idx
                                            ? "text-black dark:text-white font-semibold"
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                                    )}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* LIGHTING LAYERS 
                       We use CSS variables --spotlight-x and --ambience-x updated by JS
                    */}

                    {/* 1. The Moving Spotlight (Follows Mouse / Touch) */}
                    <div
                        className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] opacity-0 transition-opacity duration-300 will-change-transform"
                        style={{
                            opacity: hoverX !== null ? 1 : 0,
                            background: `
                  radial-gradient(
                    120px circle at var(--spotlight-x) 100%, 
                    var(--spotlight-color, rgba(0,0,0,0.1)) 0%, 
                    transparent 50%
                  )
                `
                        }}
                    />

                    {/* 2. The Active State Ambience (Stays on Active) */}
                    <div
                        className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2] will-change-transform"
                        style={{
                            background: `
                      radial-gradient(
                        60px circle at var(--ambience-x) 0%, 
                        var(--ambience-color, rgba(0,0,0,1)) 0%, 
                        transparent 100%
                      )
                    `
                        }}
                    />
                </nav>
            </div>

            {/* STYLE BLOCK for Dynamic Colors */}
            <style>{`
        nav.spotlight-nav {
          /* Light Mode Colors: Dark Gray/Black lights */
          --spotlight-color: rgba(0,0,0,0.08);
          --ambience-color: rgba(0,0,0,0.8);
        }
        :root.dark nav.spotlight-nav,
        .dark nav.spotlight-nav,
        body nav.spotlight-nav {
          /* Dark Mode Colors: White lights */
          --spotlight-color: rgba(255,255,255,0.18);
          --ambience-color: rgba(255,255,255,1);
        }
        .spotlight-nav-bg {
          background-color: rgba(17, 20, 30, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .glass-border {
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .spotlight-nav-shadow {
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
      `}</style>
        </div>
    );
}
