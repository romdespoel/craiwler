interface LoadingIndicatorProps {
  message: string;
}

export default function LoadingIndicator({ message }: LoadingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 py-6 justify-center animate-fade-in">
      <div className="flex gap-1">
        <span
          className="w-2 h-2 bg-gold rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 bg-gold rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 bg-gold rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="text-parchment-dim italic text-sm">{message}</span>
    </div>
  );
}
