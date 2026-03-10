export default function LumeLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M112 12C112 12 113 16 112 16C111 16 112 12 112 12Z"
        fill="currentColor"
      />
      <path
        d="M112 8V16M108 12H116"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
      />

      <text
        x="0"
        y="28"
        style={{
          fontFamily: "'Didot', 'Bodoni 72', serif",
          fontSize: '24px',
          fontWeight: '300',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
        fill="currentColor"
      >
        Lume
      </text>

      <rect
        x="0"
        y="34"
        width="25"
        height="0.5"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}
