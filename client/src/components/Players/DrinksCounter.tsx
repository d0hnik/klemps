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
      className="flex h-[60px] w-[60px] shrink-0 flex-col overflow-hidden rounded border"
      aria-label={`${label}: ${count}`}
      style={{
        backgroundColor: drinkType.backgroundColor,
      }}
    >
      <span
        className="flex h-[20px] w-full items-center justify-center bg-black/35 text-[16px] leading-none"
        style={{
          color: drinkType.textColor,
        }}
      >
        {label}
      </span>

      <span className="flex flex-1 items-center justify-center text-3xl leading-none text-white tabular-nums">
        {count}
      </span>
    </div>
  );
}
