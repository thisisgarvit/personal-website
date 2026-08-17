"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useReducedMotion } from "./useReducedMotion";

export interface BoardViewport {
  activeIndex: number;
  scrollToIndex: (index: number) => void;
  previous: () => void;
  next: () => void;
}

/**
 * Active-column plumbing for the horizontal scroll-snap board (Gate D2).
 *
 * The scroll container stays plain CSS scroll-snap; an
 * IntersectionObserver (root = the container) derives the dominant
 * column, and programmatic navigation uses scrollIntoView with smooth
 * behavior unless the visitor prefers reduced motion. Only the discrete
 * active index touches React state — never scroll positions.
 */
export function useBoardViewport(
  containerRef: RefObject<HTMLElement | null>,
  columnCount: number,
): BoardViewport {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  /**
   * While a smooth programmatic scroll travels, intermediate columns
   * dominate the observer; without a pending target the pager index
   * would bounce mid-flight. The target wins until reached (or a beat
   * passes — a manual swipe then reclaims observer authority).
   */
  const pendingTarget = useRef<{ index: number; until: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;
    const columns = Array.from(
      container.querySelectorAll<HTMLElement>("[data-column]"),
    );
    if (columns.length === 0) return;

    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.intersectionRatio);
        });
        let bestIndex = 0;
        let bestRatio = -1;
        columns.forEach((column, index) => {
          const ratio = ratios.get(column) ?? 0;
          if (ratio > bestRatio + 0.001) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });
        const target = pendingTarget.current;
        if (target && Date.now() < target.until && bestIndex !== target.index) {
          return;
        }
        pendingTarget.current = null;
        setActiveIndex(bestIndex);
      },
      { root: container, threshold: [0.25, 0.5, 0.75, 1] },
    );
    columns.forEach((column) => observer.observe(column));
    return () => observer.disconnect();
  }, [containerRef]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(columnCount - 1, index));
      pendingTarget.current = { index: clamped, until: Date.now() + 1000 };
      setActiveIndex(clamped);
      const container = containerRef.current;
      const column = container?.querySelectorAll<HTMLElement>("[data-column]")[
        clamped
      ];
      column?.scrollIntoView?.({
        behavior: reducedMotion ? "auto" : "smooth",
        inline: "start",
        block: "nearest",
      });
    },
    [columnCount, containerRef, reducedMotion],
  );

  const previous = useCallback(
    () => scrollToIndex(activeIndex - 1),
    [activeIndex, scrollToIndex],
  );
  const next = useCallback(
    () => scrollToIndex(activeIndex + 1),
    [activeIndex, scrollToIndex],
  );

  return { activeIndex, scrollToIndex, previous, next };
}
