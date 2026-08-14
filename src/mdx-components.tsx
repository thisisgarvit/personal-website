import type { MDXComponents } from "mdx/types";

/**
 * Required by @next/mdx with the App Router. Task 5 may extend this with
 * typed content components; Task 3 ships the pass-through only.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
