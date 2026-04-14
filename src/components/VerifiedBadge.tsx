export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      aria-label="Verified"
      title="Verified"
      className={className ?? "inline-flex items-center"}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
        className="text-brand"
      >
        <path
          fill="currentColor"
          d="M22.25 12l-2.23 2.15.52 3.08-3.02.85-1.56 2.7-2.96-1.12L12 22.25l-2.15-2.23-3.08.52-.85-3.02-2.7-1.56 1.12-2.96L1.75 12l2.23-2.15-.52-3.08 3.02-.85 1.56-2.7 2.96 1.12L12 1.75l2.15 2.23 3.08-.52.85 3.02 2.7 1.56-1.12 2.96L22.25 12z"
        />
        <path
          fill="#fff"
          d="M10.2 13.9l-1.9-1.9-1.1 1.1 3 3 6.6-6.6-1.1-1.1-5.5 5.4z"
        />
      </svg>
    </span>
  );
}

