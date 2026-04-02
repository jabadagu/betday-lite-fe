export default function LoadingHome() {
  return (
    <div className="min-h-screen bg-surface-page">
      <div className="h-14 border-b border-line-primary bg-surface-primary" />
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 w-80 shrink-0 animate-pulse rounded-xl bg-surface-secondary"
            />
          ))}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-surface-secondary" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-surface-secondary" />
          ))}
        </div>
      </div>
    </div>
  );
}
