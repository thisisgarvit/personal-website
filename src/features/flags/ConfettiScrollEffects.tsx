"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  chooseBurstOrigin,
  createBurstPieces,
  getTabScrollBurstGate,
  type ConfettiPiece,
  type EffectSuppression,
} from "./confetti";
import styles from "./flags.module.css";

interface Burst {
  id: number;
  pieces: ConfettiPiece[];
}

interface ConfettiScrollEffectsProps {
  suppression: EffectSuppression | null;
}

const colorTokens: Record<ConfettiPiece["color"], string> = {
  merge: "var(--color-merge)",
  incident: "var(--color-incident)",
  question: "var(--color-question)",
  context: "var(--color-context)",
};

export function ConfettiScrollEffects({
  suppression,
}: ConfettiScrollEffectsProps) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextBurstId = useRef(1);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const gate = getTabScrollBurstGate();
    gate.resetTravel();
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const distance = Math.abs(currentY - lastScrollY.current);
      lastScrollY.current = currentY;

      if (!gate.recordTravel(distance, suppression === null)) return;

      const active =
        document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
          ? document.activeElement.getBoundingClientRect()
          : null;
      const hero = document.getElementById("hero-title")?.getBoundingClientRect();
      const obstacles = [hero, active].filter(
        (rect): rect is DOMRect => rect !== null && rect !== undefined,
      );
      const burstId = nextBurstId.current++;
      const origin = chooseBurstOrigin(
        { width: window.innerWidth, height: window.innerHeight },
        obstacles,
        gate.burstCount,
      );
      const burst = {
        id: burstId,
        pieces: createBurstPieces(origin, burstId),
      };
      setBursts((current) => [...current, burst]);
      window.setTimeout(() => {
        setBursts((current) => current.filter((item) => item.id !== burstId));
      }, 950);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [suppression]);

  return (
    <div className={styles.confettiLayer} aria-hidden="true">
      {bursts.map((burst) => (
        <span key={burst.id} data-confetti-burst={burst.id}>
          {burst.pieces.map((piece) => {
            const pieceStyle = {
              top: piece.y,
              left: piece.side === "left" ? 8 : undefined,
              right: piece.side === "right" ? 8 : undefined,
              background: colorTokens[piece.color],
              borderRadius: piece.round ? "999px" : "1px",
              animationDelay: `${piece.delay}ms`,
              "--confetti-x": `${piece.travelX}px`,
              "--confetti-y": `${piece.travelY}px`,
              "--confetti-r": `${piece.rotation}deg`,
            } as CSSProperties;
            return <i key={piece.id} className={styles.confettiPiece} style={pieceStyle} />;
          })}
        </span>
      ))}
    </div>
  );
}
