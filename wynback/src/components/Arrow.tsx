export function Arrow({ size = 18, className = "arrow" }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
    </svg>
  );
}
