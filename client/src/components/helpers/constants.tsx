import { Check, Close, Minus, Plus } from "@nsmr/pixelart-react";

export const AFTER_GUESS_MODAL_CONFIG = {
  correct: {
    titleKey: "guessResult.correctTitle",
    messageKey: "guessResult.correctMessage",
    borderColor: "var(--color-green)",
    titleColor: "text-green-400",
    buttonColor: "bg-green-600 hover:bg-green-500",
    giveTake: "guessResult.giveOut",
    drinks: "guessResult.drinks",
    icon: (
      <Check
        size={58}
        color="green"
        className=" [filter:drop-shadow(1px_0_0_currentColor)_drop-shadow(-1px_0_0_currentColor)_drop-shadow(0_1px_0_currentColor)_drop-shadow(0_-1px_0_currentColor)]"
      />
    ),
  },
  wrong: {
    titleKey: "guessResult.wrongTitle",
    messageKey: "guessResult.wrongMessage",
    borderColor: "var(--color-red)",
    titleColor: "text-red-400",
    buttonColor: "bg-red-600 hover:bg-red-500",
    giveTake: "guessResult.take",
    drinks: "guessResult.drinks",
    icon: <Close size={52} color="red" />,
  },
} as const;

export const PLAYER_DRINKS_BUTTON_CONFIG = {
  increment: {
    borderColor: "[--border-color:var(--color-green)]",
    icon: <Plus size={24} color="green" />,
  },

  decrement: {
    borderColor: "[--border-color:var(--color-red)]",
    icon: <Minus size={24} color="red" />,
  },
} as const;
