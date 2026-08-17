import type { Metadata } from "next";
import { CaseFigure } from "@/components/case/CaseFigure";
import { CaseShell } from "@/components/case/CaseShell";
import { caseOpeningBySlug } from "@/data/case-openings";
import { workBySlug } from "@/data/work";
import Content from "./content.mdx";
import dayView from "./day-view.png";

const work = workBySlug("stay-portal");
const opening = caseOpeningBySlug("stay-portal");

export const metadata: Metadata = {
  title: work.title,
  description: work.summary,
};

/**
 * Gate E artifact-led opening: Stay Portal opens on its real day-view
 * product screenshot (PII-cleared demo data — open-questions-answers.md
 * §6), promoted out of the MDX body.
 */
export default function StayPortalPage() {
  return (
    <CaseShell
      {...opening}
      artifact={
        <CaseFigure
          image={dayView}
          alt="Stay Portal day view on a phone: each apartment listed with a 24-hour timeline bar and its bookings for Friday 17 July — guest name, hours, booking channel, amount, and payment due. All guests and numbers are synthetic demo data."
          caption="Day view, the home screen: every room as a 24-hour timeline for any date, bookings color-coded by payment state, check-out and add-booking in place."
          sizes="(max-width: 720px) 92vw, 640px"
          priority
        />
      }
    >
      <Content />
    </CaseShell>
  );
}
