import { notFound } from "next/navigation";
import { WorldPrototype } from "./WorldPrototype";

export default function WorldPrototypePage() {
  // Gate C evidence deviation: the QA harness builds with
  // NEXT_PUBLIC_WORLD_PROTOTYPE=1 so renderer measurements run against a
  // real production build. The variable is never set in deploy
  // environments, so public production behavior is unchanged (404).
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_WORLD_PROTOTYPE !== "1"
  ) {
    notFound();
  }
  return <WorldPrototype />;
}
