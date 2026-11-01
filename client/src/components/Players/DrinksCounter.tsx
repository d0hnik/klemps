import { DRINK_TYPES, type DrinkType } from "../../entities/drinks";
import "./players.css";
import { useTranslation } from "react-i18next";

type Props = {
  type: DrinkType;
  count: number;
};

export function DrinksCounter({ type, count }: Props) {
  const { t } = useTranslation();

  const drinkType = DRINK_TYPES[type];

  const label = t(`drinks.${type}`);

  return (
    <div
      className="flex size-12 shrink-0 sm:size-15 flex-col overflow-hidden rounded border"
      aria-label={`${label}: ${count}`}
      style={{
        backgroundColor: drinkType.backgroundColor,
      }}
    >
      <span
        className="flex h-[20px] w-full items-center justify-center bg-black/35 text-xs leading-none sm:text-base"
        style={{
          color: drinkType.textColor,
        }}
      >
        {label}
      </span>

      <span className="flex flex-1 items-center justify-center text-2xl leading-none sm:text-3xl text-white tabular-nums">
        {count}
      </span>
    </div>
  );
}
