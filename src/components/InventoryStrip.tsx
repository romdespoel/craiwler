interface InventoryStripProps {
  items: string[];
}

export default function InventoryStrip({ items }: InventoryStripProps) {
  if (items.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 1, marginTop: 20 }}>
      {items.map((item, i) => (
        <div
          key={`${item}-${i}`}
          style={{
            background: "#0a0a0a",
            padding: "6px 10px",
            fontSize: 10,
            color: "#444",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
