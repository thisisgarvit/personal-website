import { describe, expect, it } from "vitest";
import {
  authoredBoardPositions,
  parseBoardPositions,
  serializeBoardPositions,
} from "./storage";

describe("board storage", () => {
  it("accepts only known slugs and valid columns", () => {
    expect(
      parseBoardPositions(
        JSON.stringify({
          "stay-portal": "backlog",
          maxie: "shipped",
          "agentic-calendar": "not-a-column",
          stranger: "shipped",
        }),
      ),
    ).toEqual({
      "stay-portal": "backlog",
      maxie: "shipped",
      "agentic-calendar": "in-progress",
      "dynamic-island": "backlog",
    });
  });

  it("falls back entirely when stored JSON is malformed", () => {
    expect(parseBoardPositions("{broken")).toEqual(authoredBoardPositions);
    expect(parseBoardPositions(null)).toEqual(authoredBoardPositions);
  });

  it("serializes only the four slug-to-column entries", () => {
    expect(JSON.parse(serializeBoardPositions(authoredBoardPositions))).toEqual({
      "stay-portal": "shipped",
      maxie: "in-progress",
      "agentic-calendar": "in-progress",
      "dynamic-island": "backlog",
    });
  });
});
