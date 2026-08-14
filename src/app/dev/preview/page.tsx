import { notFound } from "next/navigation";
import { PreviewDemo } from "./PreviewDemo";

/**
 * Dev-only styling demo for the CasePreviewDialog primitive (Task 4).
 *
 * NOT linked from any navigation and NOT a public route: production
 * builds 404 here so the "exactly five public routes" contract (PRD §16)
 * holds. Used only to screenshot/verify §5.9 dialog styling before Codex
 * Task 7 wires the dialog to tickets.
 */
export default function PreviewDemoPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <PreviewDemo />;
}
