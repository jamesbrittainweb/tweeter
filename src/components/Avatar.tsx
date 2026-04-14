import Image from "next/image";

export function Avatar({
  label,
  src,
  size = 40,
  className,
}: {
  label: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const trimmed = label.trim();
  const letter = (trimmed[0] ?? "?").toUpperCase();

  const classes =
    className ??
    "inline-flex items-center justify-center rounded-full bg-border text-sm font-extrabold text-foreground";

  return (
    <div
      aria-label={label}
      title={label}
      className={classes}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={label}
          width={size}
          height={size}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        letter
      )}
    </div>
  );
}
