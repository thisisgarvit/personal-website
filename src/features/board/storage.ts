import { workItems, type BoardColumn, type WorkSlug } from "@/data/work";

export type BoardPositions = Record<WorkSlug, BoardColumn>;

const validColumns = new Set<BoardColumn>([
  "shipped",
  "in-progress",
  "backlog",
]);

export const authoredBoardPositions: BoardPositions = Object.fromEntries(
  workItems.map((item) => [item.slug, item.authoredColumn]),
) as BoardPositions;

export function parseBoardPositions(raw: string | null): BoardPositions {
  if (!raw) return { ...authoredBoardPositions };

  try {
    const candidate = JSON.parse(raw) as unknown;
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      return { ...authoredBoardPositions };
    }

    const record = candidate as Record<string, unknown>;
    return Object.fromEntries(
      workItems.map((item) => {
        const stored = record[item.slug];
        return [
          item.slug,
          typeof stored === "string" && validColumns.has(stored as BoardColumn)
            ? stored
            : item.authoredColumn,
        ];
      }),
    ) as BoardPositions;
  } catch {
    return { ...authoredBoardPositions };
  }
}

export function serializeBoardPositions(positions: BoardPositions): string {
  return JSON.stringify(
    Object.fromEntries(workItems.map((item) => [item.slug, positions[item.slug]])),
  );
}
