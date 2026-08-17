"use client";

import {
  forwardRef,
  useCallback,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
} from "react";
import type { WorldSceneId } from "./types";
import { useWorldDirector } from "./WorldProvider";

export interface WorldAnchorProps
  extends Omit<ComponentPropsWithoutRef<"section">, "id"> {
  id: WorldSceneId;
  as?: "section" | "div";
}

function assignRef(ref: ForwardedRef<HTMLElement>, node: HTMLElement | null) {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref !== null) {
    ref.current = node;
  }
}

export const WorldAnchor = forwardRef<HTMLElement, WorldAnchorProps>(
  function WorldAnchor(
    { id, as: Component = "section", children, ...props },
    forwardedRef,
  ) {
    const director = useWorldDirector();
    const setNode = useCallback(
      (node: HTMLElement | null) => {
        director.registerAnchor(id, node);
        assignRef(forwardedRef, node);
      },
      [director, forwardedRef, id],
    );

    return (
      <Component {...props} ref={setNode} data-world-anchor={id}>
        {children}
      </Component>
    );
  },
);
