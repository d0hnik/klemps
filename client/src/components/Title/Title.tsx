import "./title.css";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type Props = {
  id?: string;
  index?: string | number;
  title: string;
  level?: HeadingLevel;
};

export function Title({ id, index, title, level = 2 }: Props) {
  const HeadingTag = `h${level}` as const;

  return (
    <HeadingTag id={id} className="tab__title pixel-corners">
      {index !== undefined && <span>{index}. </span>}
      {title}
    </HeadingTag>
  );
}
