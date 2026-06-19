import "./title.css";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type TitleVariant = "default" | "special";

type Props = {
  id?: string;
  index?: string | number;
  title: string;
  level?: HeadingLevel;
  variant?: TitleVariant;
};

export function Title({
  id,
  index,
  title,
  level = 2,
  variant = "default",
}: Props) {
  const HeadingTag = `h${level}` as const;

  return (
    <HeadingTag
      id={id}
      className={`tab__title tab__title--${variant} pixel-corners`}
    >
      {index !== undefined && <span>{index}. </span>}
      {title}
    </HeadingTag>
  );
}
