import "./title.css";

type Props = {
  index: string;
  title: string;
};

export function Title({ index, title }: Props) {
  return (
    <div className="tab__title pixel-corners">
      <p>{index}. </p>
      {title}
    </div>
  );
}
