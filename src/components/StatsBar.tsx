import type { GameState } from "../types/game";

interface StatsBarProps {
  state: GameState;
}

export default function StatsBar({ state }: StatsBarProps) {
  const hpPercent = Math.round((state.hp / state.maxHp) * 100);

  return (
    <div style={{ marginBottom: 24 }}>
      {/* 5-cell stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          gap: 1,
          background: "#1a1a1a",
        }}
      >
        {/* HP Cell */}
        <div style={{ background: "#0a0a0a", padding: "10px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" as const }}>
            HP
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e0e0e0" }}>
            {state.hp}/{state.maxHp}
          </div>
          <div style={{ height: 4, background: "#1a1a1a", marginTop: 6 }}>
            <div
              style={{
                height: "100%",
                width: `${hpPercent}%`,
                background: "#ffffff",
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>

        {/* STR Cell */}
        <div style={{ background: "#0a0a0a", padding: "10px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" as const }}>
            STR
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e0e0e0" }}>
            {state.stats.strength}
          </div>
        </div>

        {/* CHA Cell */}
        <div style={{ background: "#0a0a0a", padding: "10px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" as const }}>
            CHA
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e0e0e0" }}>
            {state.stats.charisma}
          </div>
        </div>

        {/* CRE Cell */}
        <div style={{ background: "#0a0a0a", padding: "10px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" as const }}>
            CRE
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e0e0e0" }}>
            {state.stats.creativity}
          </div>
        </div>

        {/* GOLD Cell */}
        <div style={{ background: "#0a0a0a", padding: "10px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" as const }}>
            GOLD
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e0e0e0" }}>
            {state.gold}
          </div>
        </div>
      </div>

      {/* Location line */}
      <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, marginTop: 12, marginBottom: 6, textTransform: "uppercase" as const }}>
        ◆ {(state.world.location || "DUNGEON").toUpperCase()} — FLOOR {state.world.floor}
      </div>
    </div>
  );
}
