"use client";

import Link from "next/link";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { flushSync } from "react-dom";
import { announce, toast } from "@/components/toast/toast";
import shellStyles from "@/components/board/board.module.css";
import { BOARD_STORAGE_KEY } from "@/data/storage";
import {
  boardColumns,
  kindTicketLabel,
  workBySlug,
  workItems,
  type BoardColumn,
  type WorkItem,
  type WorkSlug,
} from "@/data/work";
import { emitMascotSignal } from "@/features/mascot/signals";
import styles from "./board-interactions.module.css";
import {
  DRAG_HYSTERESIS,
  GestureHistory,
  applyRubberBand,
  deriveDragRotation,
  nearestColumn,
  projectRelease,
  resolveReleaseVelocity,
  type PointSample,
  type Velocity2D,
} from "./physics";
import {
  interruptTicketSettle,
  type PresentationTransform,
  type TicketSettleHandle,
} from "./presentation";
import { applyTicketTransform, startTicketSettle } from "./spring";
import {
  authoredBoardPositions,
  parseBoardPositions,
  serializeBoardPositions,
  type BoardPositions,
} from "./storage";
import { useReducedMotion } from "./useReducedMotion";

const emptySubscribe = () => () => undefined;

const CasePreview = lazy(() =>
  import("./CasePreview").then((module) => ({ default: module.CasePreview })),
);

function readStoredBoard(): string | null {
  try {
    return sessionStorage.getItem(BOARD_STORAGE_KEY);
  } catch {
    return null;
  }
}

function pointFromEvent(event: {
  clientX: number;
  clientY: number;
  timeStamp: number;
}): PointSample {
  return { x: event.clientX, y: event.clientY, time: event.timeStamp };
}

interface ActiveDrag {
  pointerId: number;
  slug: WorkSlug;
  element: HTMLElement;
  grip: HTMLButtonElement;
  boardBounds: DOMRect;
  startPointer: PointSample;
  lastPointer: PointSample;
  startRect: DOMRect;
  base: PresentationTransform;
  currentX: number;
  currentY: number;
  rotation: number;
  history: GestureHistory;
  inheritedVelocity: Velocity2D;
  dragging: boolean;
}

export function InteractiveBoardSection() {
  const storedRaw = useSyncExternalStore(
    emptySubscribe,
    readStoredBoard,
    () => null,
  );
  const storedPositions = useMemo(
    () => parseBoardPositions(storedRaw),
    [storedRaw],
  );
  const [userPositions, setUserPositions] = useState<BoardPositions | null>(
    null,
  );
  const [dropTarget, setDropTarget] = useState<BoardColumn | null>(null);
  const [previewSlug, setPreviewSlug] = useState<WorkSlug | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const positions = userPositions ?? storedPositions;
  const reducedMotion = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const ticketRefs = useRef(new Map<WorkSlug, HTMLElement>());
  const settles = useRef(new Map<WorkSlug, TicketSettleHandle>());
  const activeDrag = useRef<ActiveDrag | null>(null);
  const acknowledgementTimers = useRef(new Set<number>());
  const previewReturnFocus = useRef<HTMLElement | null>(null);

  const openPreview = useCallback((slug: WorkSlug, opener?: HTMLElement | null) => {
    previewReturnFocus.current =
      opener ??
      ticketRefs.current
        .get(slug)
        ?.querySelector<HTMLAnchorElement>("a") ??
      null;
    setPreviewSlug(slug);
    setPreviewOpen(true);
  }, []);

  const handlePreviewOpenChange = useCallback((open: boolean) => {
    setPreviewOpen(open);
    if (!open) {
      requestAnimationFrame(() => {
        previewReturnFocus.current?.focus({ preventScroll: true });
      });
    }
  }, []);

  useEffect(
    () => () => {
      settles.current.forEach((settle) => settle.stop());
      acknowledgementTimers.current.forEach((timer) => clearTimeout(timer));
    },
    [],
  );

  const setTicketRef = useCallback(
    (slug: WorkSlug, element: HTMLElement | null) => {
      if (element) ticketRefs.current.set(slug, element);
      else ticketRefs.current.delete(slug);
    },
    [],
  );

  const persistPositions = useCallback((next: BoardPositions) => {
    try {
      sessionStorage.setItem(BOARD_STORAGE_KEY, serializeBoardPositions(next));
    } catch {
      // Board still works in memory when storage is restricted.
    }
  }, []);

  const startSettle = useCallback(
    (
      slug: WorkSlug,
      element: HTMLElement,
      from: { x: number; y: number; rotation: number },
      velocity: Velocity2D,
      onComplete: () => void = () => undefined,
    ) => {
      settles.current.get(slug)?.stop();
      const handle: TicketSettleHandle = startTicketSettle({
        element,
        from,
        velocity,
        reducedMotion,
        onComplete: () => {
          if (settles.current.get(slug) !== handle) return;
          settles.current.delete(slug);
          delete element.dataset.dragState;
          onComplete();
        },
      });
      settles.current.set(slug, handle);
    },
    [reducedMotion],
  );

  const columnCenters = useCallback(() => {
    const board = boardRef.current;
    if (!board) return [];
    return boardColumns.map((column) => {
      const element = board.querySelector<HTMLElement>(
        `[data-column="${column.id}"]`,
      );
      const rect = element?.getBoundingClientRect();
      return {
        id: column.id,
        center: rect ? rect.left + rect.width / 2 : 0,
      };
    });
  }, []);

  const releaseCapture = (drag: ActiveDrag) => {
    try {
      if (drag.grip.hasPointerCapture(drag.pointerId)) {
        drag.grip.releasePointerCapture(drag.pointerId);
      }
    } catch {
      // Capture may already be released by pointer cancellation.
    }
  };

  const onGripPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    item: WorkItem,
  ) => {
    if (activeDrag.current) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const element = ticketRefs.current.get(item.slug);
    const board = boardRef.current;
    if (!element || !board) return;

    event.preventDefault();
    const existingSettle = settles.current.get(item.slug);
    const interrupted = interruptTicketSettle(element, existingSettle);
    if (existingSettle) settles.current.delete(item.slug);
    const startRect = element.getBoundingClientRect();
    const startPointer = pointFromEvent(event);

    element.dataset.dragState = "pressed";
    element.style.willChange = "transform";
    applyTicketTransform(
      element,
      interrupted.presentation.x,
      interrupted.presentation.y,
      interrupted.presentation.rotation,
      1.015,
    );
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic/legacy pointer implementations may not expose capture.
    }

    activeDrag.current = {
      pointerId: event.pointerId,
      slug: item.slug,
      element,
      grip: event.currentTarget,
      boardBounds: board.getBoundingClientRect(),
      startPointer,
      lastPointer: startPointer,
      startRect,
      base: interrupted.presentation,
      currentX: interrupted.presentation.x,
      currentY: interrupted.presentation.y,
      rotation: interrupted.presentation.rotation,
      history: new GestureHistory(startPointer),
      inheritedVelocity: {
        x: interrupted.velocity.x,
        y: interrupted.velocity.y,
      },
      dragging: false,
    };
  };

  const onGripPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = activeDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();

    const nativeEvent = event.nativeEvent;
    const coalesced =
      typeof nativeEvent.getCoalescedEvents === "function"
        ? nativeEvent.getCoalescedEvents()
        : [];
    const samples = coalesced.length > 0 ? coalesced : [nativeEvent];
    samples.forEach((sample) => drag.history.addMove(pointFromEvent(sample)));
    const latest = pointFromEvent(samples.at(-1) ?? nativeEvent);
    const travelled = Math.hypot(
      latest.x - drag.startPointer.x,
      latest.y - drag.startPointer.y,
    );
    if (!drag.dragging && travelled < DRAG_HYSTERESIS) {
      drag.lastPointer = latest;
      return;
    }

    if (!drag.dragging) {
      drag.dragging = true;
      drag.element.dataset.dragState = "dragging";
      emitMascotSignal({
        reaction: "drag-watch",
        source: drag.slug,
        timestamp: Date.now(),
      });
    }

    const desiredLeft =
      drag.startRect.left + (latest.x - drag.startPointer.x);
    const desiredTop = drag.startRect.top + (latest.y - drag.startPointer.y);
    const maxLeft = Math.max(
      drag.boardBounds.left,
      drag.boardBounds.right - drag.startRect.width,
    );
    const maxTop = Math.max(
      drag.boardBounds.top,
      drag.boardBounds.bottom - drag.startRect.height,
    );
    const boundedLeft = applyRubberBand(
      desiredLeft,
      drag.boardBounds.left,
      maxLeft,
      Math.max(1, drag.boardBounds.width),
    );
    const boundedTop = applyRubberBand(
      desiredTop,
      drag.boardBounds.top,
      maxTop,
      Math.max(1, drag.boardBounds.height),
    );
    const elapsed = Math.max(1, latest.time - drag.lastPointer.time);
    const horizontalVelocity =
      ((latest.x - drag.lastPointer.x) / elapsed) * 1000;

    drag.currentX = drag.base.x + boundedLeft - drag.startRect.left;
    drag.currentY = drag.base.y + boundedTop - drag.startRect.top;
    drag.rotation = deriveDragRotation(horizontalVelocity, reducedMotion);
    drag.lastPointer = latest;
    applyTicketTransform(
      drag.element,
      drag.currentX,
      drag.currentY,
      drag.rotation,
      1.015,
    );

    const centers = columnCenters();
    if (centers.length > 0) {
      setDropTarget(
        nearestColumn(boundedLeft + drag.startRect.width / 2, centers),
      );
    }
  };

  const onGripPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = activeDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const up = pointFromEvent(event);
    const gestureVelocity = drag.history.finish(up);
    const releaseVelocity = resolveReleaseVelocity(
      drag.dragging,
      gestureVelocity,
      drag.inheritedVelocity,
    );
    activeDrag.current = null;
    releaseCapture(drag);
    setDropTarget(null);

    if (!drag.dragging) {
      startSettle(
        drag.slug,
        drag.element,
        {
          x: drag.currentX,
          y: drag.currentY,
          rotation: drag.rotation,
        },
        releaseVelocity,
      );
      return;
    }

    emitMascotSignal({
      reaction: "idle",
      source: drag.slug,
      timestamp: Date.now(),
    });
    const oldRect = drag.element.getBoundingClientRect();
    const centers = columnCenters();
    const destination = nearestColumn(
      oldRect.left +
        oldRect.width / 2 +
        (reducedMotion ? 0 : projectRelease(releaseVelocity.x)),
      centers,
    );
    const nextPositions = { ...positions, [drag.slug]: destination };
    flushSync(() => setUserPositions(nextPositions));
    persistPositions(nextPositions);

    const moved = ticketRefs.current.get(drag.slug);
    if (!moved) return;
    moved.style.transform = "none";
    moved.style.removeProperty("will-change");
    delete moved.dataset.dragState;
    const restingRect = moved.getBoundingClientRect();
    const from = {
      x:
        oldRect.left +
        oldRect.width / 2 -
        (restingRect.left + restingRect.width / 2),
      y:
        oldRect.top +
        oldRect.height / 2 -
        (restingRect.top + restingRect.height / 2),
      rotation: reducedMotion ? 0 : drag.rotation,
    };
    const velocity = reducedMotion ? { x: 0, y: 0 } : releaseVelocity;
    startSettle(drag.slug, moved, from, velocity, () => {
      if (destination !== "shipped") return;
      emitMascotSignal({
        reaction: "shipped",
        source: drag.slug,
        timestamp: Date.now(),
      });
      openPreview(drag.slug);
    });
  };

  const onGripPointerCancel = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const drag = activeDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    activeDrag.current = null;
    releaseCapture(drag);
    setDropTarget(null);
    if (drag.dragging) {
      emitMascotSignal({
        reaction: "idle",
        source: drag.slug,
        timestamp: Date.now(),
      });
    }
    startSettle(
      drag.slug,
      drag.element,
      { x: drag.currentX, y: drag.currentY, rotation: drag.rotation },
      drag.dragging ? { x: 0, y: 0 } : drag.inheritedVelocity,
    );
  };

  const moveByKeyboard = (
    event: KeyboardEvent<HTMLAnchorElement>,
    item: WorkItem,
  ) => {
    if (!event.altKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentIndex = boardColumns.findIndex(
      (column) => column.id === positions[item.slug],
    );
    const nextIndex = Math.max(
      0,
      Math.min(
        boardColumns.length - 1,
        currentIndex + (event.key === "ArrowRight" ? 1 : -1),
      ),
    );
    if (nextIndex === currentIndex) return;

    const destination = boardColumns[nextIndex];
    const nextPositions = { ...positions, [item.slug]: destination.id };
    flushSync(() => setUserPositions(nextPositions));
    persistPositions(nextPositions);

    const moved = ticketRefs.current.get(item.slug);
    const link = moved?.querySelector<HTMLAnchorElement>("a");
    moved?.setAttribute("data-keyboard-ack", "true");
    link?.focus({ preventScroll: true });
    const timer = window.setTimeout(() => {
      moved?.removeAttribute("data-keyboard-ack");
      acknowledgementTimers.current.delete(timer);
    }, 160);
    acknowledgementTimers.current.add(timer);
    announce(`${item.title} moved to ${destination.label}`);

    if (destination.id === "shipped") {
      window.setTimeout(() => openPreview(item.slug, link), 0);
    }
  };

  const openFromBody = (event: MouseEvent<HTMLAnchorElement>, slug: WorkSlug) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    openPreview(slug, event.currentTarget);
  };

  const resetBoard = () => {
    const drag = activeDrag.current;
    if (drag) {
      releaseCapture(drag);
      if (drag.dragging) {
        emitMascotSignal({
          reaction: "idle",
          source: drag.slug,
          timestamp: Date.now(),
        });
      }
    }
    activeDrag.current = null;
    settles.current.forEach((settle) => settle.stop());
    settles.current.clear();
    ticketRefs.current.forEach((element) => {
      element.style.removeProperty("transform");
      element.style.removeProperty("will-change");
      element.style.removeProperty("opacity");
      delete element.dataset.dragState;
      delete element.dataset.settle;
    });
    flushSync(() => setUserPositions({ ...authoredBoardPositions }));
    try {
      sessionStorage.removeItem(BOARD_STORAGE_KEY);
    } catch {
      // The authored reset still applies in memory.
    }
    setDropTarget(null);
    toast("Board reset. No sprint ceremony required.");
  };

  const previewItem = previewSlug ? workBySlug(previewSlug) : null;

  return (
    <>
      <section className={shellStyles.section} aria-labelledby="board-title">
        <header className={shellStyles.head}>
          <div>
            <h2 id="board-title" className={shellStyles.title}>
              Things I’ve built
            </h2>
            <p className={shellStyles.subtitle}>
              THE BOARD IS THE NAVIGATION · DRAG ANYTHING
            </p>
          </div>
          <div className={shellStyles.actions}>
            <span className={shellStyles.keyboardHint} id="board-keyboard-help">
              ENTER opens · ALT + ←/→ moves
            </span>
            <span className={styles.helper}>State lasts for this tab.</span>
            <button
              type="button"
              className={shellStyles.reset}
              onClick={resetBoard}
            >
              <span aria-hidden="true">↺</span>
              <span className={shellStyles.resetLabel}> Reset board</span>
            </button>
          </div>
        </header>
        <div className={shellStyles.board} ref={boardRef} data-board>
          {boardColumns.map((column) => {
            const items = workItems.filter(
              (item) => positions[item.slug] === column.id,
            );
            return (
              <section
                key={column.id}
                className={`${shellStyles.column} ${styles.interactiveColumn}`}
                data-column={column.id}
                data-drop-target={dropTarget === column.id ? "true" : undefined}
                aria-labelledby={`column-${column.id}`}
              >
                <header className={shellStyles.columnHead}>
                  <b id={`column-${column.id}`}>{column.label}</b>
                  <span className={shellStyles.count}>{items.length}</span>
                </header>
                <div className={shellStyles.ticketList}>
                  {items.map((item) => (
                    <article
                      key={item.slug}
                      ref={(element) => setTicketRef(item.slug, element)}
                      className={`${shellStyles.ticket} ${styles.interactiveTicket}`}
                      data-accent={item.accent}
                      data-ticket={item.slug}
                    >
                      <Link
                        href={item.route}
                        className={shellStyles.ticketBody}
                        aria-describedby="board-keyboard-help"
                        aria-keyshortcuts="Enter Alt+ArrowLeft Alt+ArrowRight"
                        onClick={(event) => openFromBody(event, item.slug)}
                        onKeyDown={(event) => moveByKeyboard(event, item)}
                      >
                        <span className={shellStyles.ticketId}>
                          {item.id} · {kindTicketLabel(item.kind)}
                        </span>
                        <h3 className={shellStyles.ticketTitle}>{item.title}</h3>
                        <p className={shellStyles.ticketSummary}>{item.summary}</p>
                        <span className={shellStyles.chips}>
                          <span
                            className={`${shellStyles.chip} ${shellStyles.chipPriority}`}
                          >
                            {item.priority}
                          </span>
                          <span className={shellStyles.chip}>{item.points}</span>
                        </span>
                        <span className={shellStyles.candidNote} data-candid-note>
                          {item.candidNote}
                        </span>
                      </Link>
                      <button
                        type="button"
                        tabIndex={-1}
                        className={`${shellStyles.grip} ${styles.interactiveGrip}`}
                        aria-label={`Drag ${item.title}`}
                        onPointerDown={(event) => onGripPointerDown(event, item)}
                        onPointerMove={onGripPointerMove}
                        onPointerUp={onGripPointerUp}
                        onPointerCancel={onGripPointerCancel}
                      >
                        <span aria-hidden="true">⠿</span>
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {previewItem ? (
        <Suspense fallback={null}>
          <CasePreview
            item={previewItem}
            open={previewOpen}
            onOpenChange={handlePreviewOpenChange}
          />
        </Suspense>
      ) : null}
    </>
  );
}
