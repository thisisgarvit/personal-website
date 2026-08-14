"use client";

import { useState } from "react";
import { CasePreviewDialog } from "@/components/case-preview/CasePreviewDialog";
import { workItems } from "@/data/work";

/**
 * Static demo instance of the case-preview dialog, populated with the
 * Stay Portal ticket (GAR-101). Lede and the situation/bet summary are
 * VERBATIM from the approved slice's `cases.stay` data — Codex Task 7 /
 * Task 5 own the production preview content wiring; this file exists
 * only so the §5.9 styling can be reviewed in isolation.
 */
export function PreviewDemo() {
  const [open, setOpen] = useState(true);
  const stay = workItems[0];

  return (
    <main style={{ padding: "var(--space-8)" }}>
      <button type="button" onClick={() => setOpen(true)}>
        Open case preview demo
      </button>
      <CasePreviewDialog
        open={open}
        onOpenChange={setOpen}
        kindLabel="SHIPPED PRODUCT"
        ticketId={stay.id}
        title={stay.title}
        lede="A phone-first booking manager for five flexibly rented apartments—built around the actual messiness of hourly, half-day, and full-day stays."
        facts={stay.previewFacts}
        readFullCaseHref={stay.route}
      >
        <h3>The constraint</h3>
        <p>
          The owner ran the operation in one Google Sheets tab per room.
          Several bookings could happen in one room on one day, across
          Airbnb, walk-ins, and referrals.
        </p>
        <h3>The product bet</h3>
        <p>
          Prevent overlaps at the database layer, make today legible on a
          phone, and mirror data back to Sheets as an adoption bridge—not a
          forced migration.
        </p>
      </CasePreviewDialog>
    </main>
  );
}
