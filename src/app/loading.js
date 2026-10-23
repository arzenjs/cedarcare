export default function Loading() {
  return (
    <div className="page-width py-28" role="status" aria-live="polite">
      <div className="h-8 w-56 animate-pulse rounded bg-mist" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-mist" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
