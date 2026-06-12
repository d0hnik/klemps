import "./players.css";
import { useTranslation } from "react-i18next";

type Props = {
  type: string;
  count: number;
  label: string;
};

export function PlayersTab({ type, label, count }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex">
      {label}
      {count}
    </div>
  );
}
