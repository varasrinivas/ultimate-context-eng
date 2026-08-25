import './primitives.css';

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="state-box" role="alert">
      <span className="title">Couldn't load this</span>
      <span className="small">{message}</span>
      {retry && (
        <button type="button" onClick={retry} className="chip">
          Try again
        </button>
      )}
    </div>
  );
}
