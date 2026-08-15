import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { latestReleaseLine } from "@/data/releases";
import { productLabel, siteConfig } from "@/data/site";
import {
  boardColumns,
  kindTicketLabel,
  workItems,
  type BoardColumn,
} from "@/data/work";

export const alt = "Garvit Sukhija portfolio board";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const archivo = readFile(
  join(process.cwd(), "src/fonts/Archivo-Og-800.ttf"),
);
const plexMono = readFile(
  join(process.cwd(), "src/fonts/IBMPlexMono-Og-600.ttf"),
);

const palette = {
  canvas: "#edf0eb",
  panel: "#f8f9f4",
  panel2: "#e3e8e2",
  ink: "#171923",
  muted: "#5f675f",
  rule: "#aeb7ad",
  release: "#3f49e8",
  merge: "#cbed45",
  incident: "#ff6b52",
  question: "#c4b7ff",
  context: "#72d7d0",
} as const;

const accentColor = {
  merge: palette.merge,
  incident: palette.incident,
  question: palette.question,
  context: palette.context,
} as const;

function Column({ column }: { column: BoardColumn }) {
  const item = workItems.find((candidate) => candidate.authoredColumn === column);
  const label = boardColumns.find((candidate) => candidate.id === column)?.label;

  if (!item || !label) return null;

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        borderRight:
          column === "backlog" ? "0px solid transparent" : `1px solid ${palette.ink}`,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 42,
          padding: "0 18px",
          borderBottom: `1px solid ${palette.ink}`,
          fontFamily: "IBM Plex Mono",
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: "0.055em",
          textTransform: "uppercase",
        }}
      >
        <span>{label}</span>
        <span style={{ color: palette.muted }}>01</span>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          padding: 12,
          background: palette.panel2,
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0,
            padding: "12px 14px 11px",
            border: `1px solid ${palette.ink}`,
            borderTop: `8px solid ${accentColor[item.accent]}`,
            borderRadius: 8,
            background: palette.panel,
          }}
        >
          <div
            style={{
              display: "flex",
              color: palette.muted,
              fontFamily: "IBM Plex Mono",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.045em",
            }}
          >
            {item.id} · {kindTicketLabel(item.kind)}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Archivo",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
            }}
          >
            {item.title}
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            <span
              style={{
                display: "flex",
                padding: "4px 8px",
                border: `1px solid ${palette.ink}`,
                borderRadius: 999,
                background: accentColor[item.accent],
                fontFamily: "IBM Plex Mono",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {item.priority}
            </span>
            <span
              style={{
                display: "flex",
                padding: "4px 8px",
                border: `1px solid ${palette.rule}`,
                borderRadius: 999,
                fontFamily: "IBM Plex Mono",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {item.points}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OgCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: palette.canvas,
        color: palette.ink,
        border: `2px solid ${palette.ink}`,
        fontFamily: "Archivo",
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: `2px solid ${palette.ink}`,
          background: palette.panel,
          fontFamily: "IBM Plex Mono",
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: "0.055em",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              display: "flex",
              width: 11,
              height: 11,
              borderRadius: 999,
              background: palette.merge,
              border: `1px solid ${palette.ink}`,
            }}
          />
          <span>{productLabel}</span>
        </div>
        <span>{siteConfig.location.toUpperCase()}</span>
      </div>

      <div
        style={{
          height: 54,
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          borderBottom: `2px solid ${palette.ink}`,
          background: palette.release,
          color: palette.panel,
          fontFamily: "IBM Plex Mono",
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "0.025em",
        }}
      >
        {latestReleaseLine}
      </div>

      <div
        style={{
          height: 298,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "34px 42px 36px",
          gap: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: 14,
              fontFamily: "IBM Plex Mono",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.055em",
              textTransform: "uppercase",
              color: palette.muted,
            }}
          >
            Portfolio · production build
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 980,
              fontFamily: "Archivo",
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: "-0.055em",
              lineHeight: 0.9,
            }}
          >
            {siteConfig.personName}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 820,
              marginTop: 16,
              fontFamily: "Archivo",
              fontSize: 31,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            {siteConfig.hero}
          </div>
        </div>
        <div
          style={{
            width: 142,
            height: 142,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${palette.ink}`,
            borderRadius: 999,
            background: palette.merge,
            transform: "rotate(5deg)",
            fontFamily: "IBM Plex Mono",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          <span>Build</span>
          <span style={{ fontSize: 28, lineHeight: 1.05 }}>healthy</span>
        </div>
      </div>

      <div
        style={{
          height: 212,
          display: "flex",
          borderTop: `2px solid ${palette.ink}`,
          background: palette.panel,
        }}
      >
        <Column column="shipped" />
        <Column column="in-progress" />
        <Column column="backlog" />
      </div>
    </div>
  );
}

export default async function Image() {
  const [archivoData, plexMonoData] = await Promise.all([archivo, plexMono]);

  return new ImageResponse(<OgCard />, {
    ...size,
    fonts: [
      {
        name: "Archivo",
        data: archivoData,
        style: "normal",
        weight: 800,
      },
      {
        name: "IBM Plex Mono",
        data: plexMonoData,
        style: "normal",
        weight: 600,
      },
    ],
  });
}
