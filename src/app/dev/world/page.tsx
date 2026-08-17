import { notFound } from "next/navigation";
import { WorldPrototype } from "./WorldPrototype";

export default function WorldPrototypePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <WorldPrototype />;
}
