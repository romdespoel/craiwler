import { useGame } from "./hooks/useGame";
import TitleScreen from "./components/TitleScreen";
import GameScreen from "./components/GameScreen";
import DeathScreen from "./components/DeathScreen";
import VictoryScreen from "./components/VictoryScreen";

export default function App() {
  const {
    state,
    setApiKey,
    startGame,
    selectOption,
    selectSubOption,
    submitCustomInput,
    loadMore,
    clearSelection,
    resetGame,
    retryAfterError,
  } = useGame();

  switch (state.phase) {
    case "title":
      return (
        <TitleScreen
          apiKey={state.apiKey}
          onApiKeyChange={setApiKey}
          onStart={startGame}
        />
      );

    case "playing":
      return (
        <GameScreen
          state={state}
          onSelectOption={selectOption}
          onSelectSubOption={selectSubOption}
          onSubmitCustomInput={submitCustomInput}
          onLoadMore={loadMore}
          onClearSelection={clearSelection}
          onRetryAfterError={retryAfterError}
        />
      );

    case "dead":
      return <DeathScreen state={state} onRestart={resetGame} />;

    case "victory":
      return <VictoryScreen state={state} onRestart={resetGame} />;

    default:
      return null;
  }
}
