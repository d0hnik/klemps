import { AfterGuessModal } from "../components/Modals/AfterGuessModal";
import { createFakeGame } from "../entities/gameState";

export function TestView() {
  const game = createFakeGame();
  return (
    <>
      <div className="">
        <AfterGuessModal
          isCorrect={true}
          gameState={game}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </>
  );
}
