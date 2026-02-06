import { useState } from "react";

interface CustomInputProps {
  onSubmit: (input: string) => void;
  loading: boolean;
}

export default function CustomInput({ onSubmit, loading }: CustomInputProps) {
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed.length === 0 || loading) return;
    onSubmit(trimmed);
    setValue("");
    setExpanded(false);
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full py-2 mt-2 text-sm font-display text-parchment-dim/50 tracking-wider hover:text-parchment-dim transition-colors border border-dashed border-gold-dim/15 rounded hover:border-gold-dim/30"
      >
        WRITE YOUR OWN ACTION
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, 200))}
        placeholder="Describe your action..."
        maxLength={200}
        rows={2}
        className="w-full bg-abyss-light border border-gold-dim/30 text-parchment px-3 py-2 rounded text-sm focus:outline-none focus:border-gold transition-colors resize-none"
        autoFocus
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-parchment-dim/40">{value.length}/200</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setExpanded(false);
              setValue("");
            }}
            className="text-xs font-display text-parchment-dim/50 hover:text-parchment-dim tracking-wider px-3 py-1"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={value.trim().length === 0 || loading}
            className={`text-xs font-display tracking-wider px-4 py-1 rounded border transition-colors ${
              value.trim().length > 0 && !loading
                ? "border-gold text-gold hover:bg-gold/10 cursor-pointer"
                : "border-gold-dim/20 text-gold-dim/40 cursor-not-allowed"
            }`}
          >
            COMMIT ACTION
          </button>
        </div>
      </div>
    </div>
  );
}
