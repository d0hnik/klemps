import { Title } from "../Title/Title";
import "./difficultyTab.css";

export function DifficultyTab() {
  return (
    <section className="difficulty-tab">
      <div className="players-tab__title">
        <Title index={"2"} title={"DIFFICULTY"} />
      </div>
    </section>
  );
}
