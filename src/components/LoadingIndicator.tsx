interface LoadingIndicatorProps {
  message: string;
}

export default function LoadingIndicator({ message }: LoadingIndicatorProps) {
  return (
    <div className="animate-fade-in" style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ marginBottom: 8, letterSpacing: 6 }}>
        <span className="dot-pulse" style={{ color: "#555", animationDelay: "0s" }}>·</span>
        {" "}
        <span className="dot-pulse" style={{ color: "#555", animationDelay: "0.2s" }}>·</span>
        {" "}
        <span className="dot-pulse" style={{ color: "#555", animationDelay: "0.4s" }}>·</span>
      </div>
      <div style={{ color: "#555", fontStyle: "italic", fontSize: 13 }}>
        {message}
      </div>
    </div>
  );
}
