"use client";

import { useRef, type KeyboardEvent } from "react";
import type { BoardColumn } from "@/data/work";
import styles from "./board-interactions.module.css";

export interface MobileColumnNavProps {
  columns: readonly { id: BoardColumn; label: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Explicit mobile board discovery (Gate D2): labelled column tabs with
 * roving selection, a visible "n of 3" position, and previous/next
 * controls. Every control is a real button — no gesture is required to
 * reach any column, and the tickets themselves remain plain links.
 */
export function MobileColumnNav({
  columns,
  activeIndex,
  onSelect,
  onPrevious,
  onNext,
}: MobileColumnNavProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveSelection = (event: KeyboardEvent<HTMLButtonElement>) => {
    let target: number;
    switch (event.key) {
      case "ArrowRight":
        target = Math.min(columns.length - 1, activeIndex + 1);
        break;
      case "ArrowLeft":
        target = Math.max(0, activeIndex - 1);
        break;
      case "Home":
        target = 0;
        break;
      case "End":
        target = columns.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (target === activeIndex) return;
    onSelect(target);
    tabRefs.current[target]?.focus();
  };

  return (
    <div className={styles.mobileNav} data-board-mobile-nav>
      <div
        role="tablist"
        aria-label="Board columns"
        className={styles.columnTabs}
      >
        {columns.map((column, index) => (
          <button
            key={column.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`board-tab-${column.id}`}
            aria-selected={index === activeIndex}
            aria-controls={`board-column-${column.id}`}
            tabIndex={index === activeIndex ? 0 : -1}
            className={styles.columnTab}
            onClick={() => onSelect(index)}
            onKeyDown={moveSelection}
          >
            {column.label}
          </button>
        ))}
      </div>
      <div className={styles.pager}>
        <button
          type="button"
          className={styles.pagerButton}
          aria-label="Previous column"
          onClick={onPrevious}
          disabled={activeIndex === 0}
        >
          <span aria-hidden="true">←</span>
        </button>
        <span className={styles.position} data-board-position>
          {activeIndex + 1} of {columns.length}
        </span>
        <button
          type="button"
          className={styles.pagerButton}
          aria-label="Next column"
          onClick={onNext}
          disabled={activeIndex === columns.length - 1}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
