import { useState } from "react";
import type { PlayerClass } from "../types/game";
import { CLASSES } from "../config/classes";

interface TitleScreenProps {
  apiKey: string;
  grokApiKey: string;
  onApiKeyChange: (key: string) => void;
  onGrokApiKeyChange: (key: string) => void;
  onStart: (playerClass: PlayerClass) => void;
}

export default function TitleScreen({ apiKey, grokApiKey, onApiKeyChange, onGrokApiKeyChange, onStart }: TitleScreenProps) {
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null);

  const canStart = apiKey.trim().length > 0 && selectedClass !== null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Title */}
      <h1 className="font-display text-5xl md:text-7xl text-gold tracking-wider mb-2">
        DUNGEON
      </h1>
      <h1 className="font-display text-5xl md:text-7xl text-gold tracking-wider mb-4">
        CRAIWLER
      </h1>
      <p className="text-parchment-dim text-lg italic mb-12">
        You feel like a co-author of your story, but you can absolutely die in it.
      </p>

      {/* API Keys */}
      <div className="w-full max-w-md mb-10 space-y-6">
        <div>
          <label className="block font-display text-sm text-parchment-dim mb-2 tracking-wide">
            ANTHROPIC API KEY
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full bg-abyss-light border border-gold-dim/40 text-parchment px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors font-body text-lg"
          />
        </div>
        <div>
          <label className="block font-display text-sm text-parchment-dim mb-2 tracking-wide">
            GROK API KEY <span className="text-parchment-dim/40">(for video highlights)</span>
          </label>
          <input
            type="password"
            value={grokApiKey}
            onChange={(e) => onGrokApiKeyChange(e.target.value)}
            placeholder="xai-..."
            className="w-full bg-abyss-light border border-gold-dim/40 text-parchment px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors font-body text-lg"
          />
        </div>
        <p className="text-parchment-dim/60 text-sm">
          Keys are used client-side only and never stored.
        </p>
      </div>

      {/* Class Selection */}
      <h2 className="font-display text-xl text-parchment tracking-wide mb-6">
        CHOOSE YOUR CLASS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-10">
        {CLASSES.map((cls) => {
          const isSelected = selectedClass?.name === cls.name;
          return (
            <button
              key={cls.name}
              onClick={() => setSelectedClass(cls)}
              className={`text-left p-5 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? "border-gold bg-gold/10 shadow-[0_0_15px_rgba(201,168,76,0.15)]"
                  : "border-gold-dim/30 bg-abyss-light hover:border-gold-dim/60"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{cls.emoji}</span>
                <span className="font-display text-lg text-gold">{cls.name}</span>
              </div>
              <p className="text-parchment-dim text-sm mb-3">{cls.description}</p>
              <div className="flex gap-3 text-xs font-display tracking-wider">
                <span className="text-str">STR {cls.stats.strength}</span>
                <span className="text-cha">CHA {cls.stats.charisma}</span>
                <span className="text-cre">CRE {cls.stats.creativity}</span>
              </div>
              <div className="flex gap-3 text-xs mt-1 text-parchment-dim">
                <span>HP {cls.hp}</span>
                <span>Gold {cls.gold}</span>
              </div>
              <div className="text-xs text-parchment-dim/70 mt-2">
                {cls.inventory.join(", ")}
              </div>
            </button>
          );
        })}
      </div>

      {/* Start Button */}
      <button
        disabled={!canStart}
        onClick={() => selectedClass && onStart(selectedClass)}
        className={`font-display text-xl tracking-widest px-12 py-4 rounded-lg border transition-all duration-300 ${
          canStart
            ? "border-gold text-gold hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] cursor-pointer"
            : "border-gold-dim/20 text-gold-dim/40 cursor-not-allowed"
        }`}
      >
        DESCEND
      </button>
    </div>
  );
}
