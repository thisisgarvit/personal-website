export function MascotPoster() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 360 220"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(15 0)">
        <path
          d="M122 217c4-48 6-85 26-103 13-11 53-12 68 0 21 17 25 56 31 103Z"
          fill="var(--color-release)"
          stroke="var(--color-ink)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M136 132c-22 18-31 47-29 75"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="19"
          strokeLinecap="round"
        />
        <path
          d="M224 133c27 17 35 43 31 70"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="19"
          strokeLinecap="round"
        />
        <circle cx="108" cy="205" r="11" fill="var(--color-ink)" />
        <circle cx="254" cy="202" r="11" fill="var(--color-ink)" />

        <path
          d="M168 105h28v28h-28z"
          fill="var(--color-ink)"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
        <g transform="rotate(-5 183 67)">
          <rect
            x="129"
            y="19"
            width="106"
            height="93"
            rx="46"
            fill="var(--color-ink)"
          />
          <path
            d="M139 57c5-26 27-39 49-39 25 0 44 13 47 38"
            fill="none"
            stroke="var(--color-incident)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <rect
            x="216"
            y="55"
            width="12"
            height="28"
            rx="6"
            fill="var(--color-incident)"
          />
          <path
            d="M224 77c13 6 14 14 5 21"
            fill="none"
            stroke="var(--color-incident)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="226" cy="99" r="4" fill="var(--color-incident)" />
          <ellipse cx="161" cy="68" rx="14" ry="17" fill="var(--color-panel)" />
          <ellipse cx="201" cy="66" rx="14" ry="17" fill="var(--color-panel)" />
          <circle cx="166" cy="70" r="6" fill="var(--color-release)" />
          <circle cx="206" cy="68" r="6" fill="var(--color-release)" />
          <path
            d="M173 91c10 5 19 4 27-2"
            fill="none"
            stroke="var(--color-panel)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        <g data-mascot-part="pager" transform="rotate(5 214 154)">
          <rect
            x="195"
            y="137"
            width="42"
            height="34"
            rx="6"
            fill="var(--color-incident)"
            stroke="var(--color-ink)"
            strokeWidth="4"
          />
          <rect
            x="203"
            y="145"
            width="19"
            height="9"
            rx="2"
            fill="var(--color-ink)"
          />
          <circle cx="228" cy="150" r="4" fill="var(--color-merge)" />
        </g>
      </g>
    </svg>
  );
}
