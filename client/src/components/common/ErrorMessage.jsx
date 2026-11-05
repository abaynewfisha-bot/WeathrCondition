export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="my-[14px] rounded-xl bg-[#3a2028] p-4 text-[#ff9999]" role="alert">
      <p className="mb-3">{message}</p>
      {onRetry && (
        <button className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[#293a52] px-3 py-[9px] text-[#e7edf7] hover:border-[#ffa52f]" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
