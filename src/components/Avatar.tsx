export function Avatar({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const trimmed = label.trim();
  const letter = (trimmed[0] ?? "?").toUpperCase();

  return (
    <div
      aria-label={label}
      title={label}
      className={
        className ??
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-border text-sm font-extrabold text-foreground"
      }
    >
      {letter}
    </div>
  );
}

