import { useState } from "react";

interface InventoryStripProps {
  items: string[];
}

export default function InventoryStrip({ items }: InventoryStripProps) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="border-b border-gold-dim/10 bg-abyss-light/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 flex items-center justify-between text-xs font-display text-parchment-dim tracking-wider hover:text-parchment transition-colors"
      >
        <span>INVENTORY ({items.length})</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="px-3 py-1 bg-abyss-lighter border border-gold-dim/20 rounded text-sm text-parchment"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
