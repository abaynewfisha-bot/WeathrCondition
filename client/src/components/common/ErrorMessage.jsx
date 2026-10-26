export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button className="secondary-button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
