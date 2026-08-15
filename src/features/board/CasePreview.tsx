"use client";

import { CasePreviewDialog } from "@/components/case-preview/CasePreviewDialog";
import type { WorkItem } from "@/data/work";
import {
  PreviewArtifact,
  PreviewDetails,
  previewContent,
} from "./preview-content";

interface CasePreviewProps {
  item: WorkItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Lazy preview boundary: the substantial artifact/dialog code loads only
 * after a visitor asks for it. Keeping this component mounted after close
 * lets Radix complete its focus-return lifecycle before a later preview.
 */
export function CasePreview({ item, open, onOpenChange }: CasePreviewProps) {
  const content = previewContent[item.slug];

  return (
    <CasePreviewDialog
      open={open}
      onOpenChange={onOpenChange}
      kindLabel={content.kindLabel}
      ticketId={item.id}
      title={item.title}
      lede={content.lede}
      facts={item.previewFacts}
      artifact={<PreviewArtifact slug={item.slug} />}
      readFullCaseHref={item.route}
    >
      <PreviewDetails slug={item.slug} />
    </CasePreviewDialog>
  );
}
