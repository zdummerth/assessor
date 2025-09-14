export function Info({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-sm text-foreground/80">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
