import { describe, expect, it } from "vitest";
import { createGame, type GameState } from "./gameState";
import { ROUND_ORDER } from "./roundType";
import { completeTurn, getDrinksForRound } from "./turn";

function createTestGame() {
  return createGame([
    { name: "Alex", avatarSrc: "/players/avatar1.png" },
    { name: "Jordan", avatarSrc: "/players/avatar2.png" },
    { name: "Sam", avatarSrc: "/players/avatar3.png" },
  ], "HARD");
}

describe("completeTurn", () => {
  it("credits the giver and recipients once without mutating the previous game", () => {
    const game = createTestGame();
    game.currentRoundType = "INSIDE_OUTSIDE";
    game.players[0].drinksGiven = 3;
    game.players[1].drinksTaken = 2;
    const before = structuredClone(game);
    const next = completeTurn(game, true, { [game.players[1].id]: 4, [game.players[2].id]: 2 });
    expect(next.players.map((player) => [player.drinksGiven, player.drinksTaken])).toEqual([[9, 0], [0, 6], [0, 2]]);
    expect(next.currentPlayerIndex).toBe(1);
    expect(game).toEqual(before);
  });

  it("allows the entire allowance to go to one other player, including duplicate names", () => {
    const game = createTestGame();
    game.players[1].name = game.players[2].name;
    const next = completeTurn(game, true, { [game.players[2].id]: 2 });
    expect(next.players[1].drinksTaken).toBe(0);
    expect(next.players[2].drinksTaken).toBe(2);
    expect(next.players[0].drinksGiven).toBe(2);
  });

  const invalidAllocations: { name: string; allocation: (game: GameState) => Record<string, number> }[] = [
    { name: "unassigned drinks", allocation: () => ({}) },
    { name: "partly assigned drinks", allocation: (game) => ({ [game.players[1].id]: 1 }) },
    { name: "too many drinks", allocation: (game) => ({ [game.players[1].id]: 3 }) },
    { name: "negative drinks", allocation: (game) => ({ [game.players[1].id]: -1, [game.players[2].id]: 3 }) },
    { name: "fractional drinks", allocation: (game) => ({ [game.players[1].id]: 0.5, [game.players[2].id]: 1.5 }) },
    { name: "self allocation", allocation: (game) => ({ [game.players[0].id]: 2 }) },
    { name: "unknown recipients", allocation: () => ({ missing: 2 }) },
    { name: "NaN", allocation: (game) => ({ [game.players[1].id]: NaN }) },
    { name: "infinite drinks", allocation: (game) => ({ [game.players[1].id]: Infinity }) },
  ];

  it.each(invalidAllocations)("rejects $name without changing the game", ({ allocation }) => {
    const game = createTestGame();
    const before = structuredClone(game);
    expect(() => completeTurn(game, true, allocation(game))).toThrow();
    expect(game).toEqual(before);
  });

  it("adds a wrong-guess penalty only to the active player", () => {
    const game = createTestGame();
    game.currentPlayerIndex = 1;
    game.currentRoundType = "SUIT";
    game.players[1].drinksTaken = 3;
    const next = completeTurn(game, false);
    expect(next.players.map((player) => [player.drinksGiven, player.drinksTaken])).toEqual([[0, 0], [0, 11], [0, 0]]);
    expect(next.currentPlayerIndex).toBe(2);
  });

  it("includes the last allocation in the finished game's statistics", () => {
    const game = createTestGame();
    game.currentPlayerIndex = 2;
    game.currentRoundType = "SUIT";
    const next = completeTurn(game, true, { [game.players[0].id]: 5, [game.players[1].id]: 3 });
    expect(next.gameStatus).toBe("FINISHED");
    expect(next.players[2].drinksGiven).toBe(8);
    expect(next.players[0].drinksTaken).toBe(5);
    expect(next.players[1].drinksTaken).toBe(3);
    expect(() => completeTurn(next, false)).toThrow();
  });

  it("keeps cumulative totals through all four rounds with mixed results", () => {
    let game = createGame([
      { name: "Alex", avatarSrc: "/players/avatar1.png" },
      { name: "Jordan", avatarSrc: "/players/avatar2.png" },
    ], "EASY");
    for (const round of ROUND_ORDER) {
      expect(game.currentRoundType).toBe(round);
      game = completeTurn(game, true, { [game.players[1].id]: getDrinksForRound(game) });
      game = completeTurn(game, false);
    }
    expect(game.gameStatus).toBe("FINISHED");
    expect(game.players.map((player) => [player.drinksGiven, player.drinksTaken])).toEqual([[10, 0], [0, 20]]);
  });
});
