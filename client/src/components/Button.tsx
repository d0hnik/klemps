type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "red" | "black";
};

export const Button = ({ children, onClick, variant = "red" }: ButtonProps) => {
  const base =
    "font-pixel px-8 py-4 text-2xl border-4 border-black shadow-[4px_4px_0px_#000] transition-all";

  const variants = {
    red: "my-red",
    black: "bg-black text-white",
  };

  const clickAnimation = "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${clickAnimation}`}
    >
      {children}
    </button>
  );
};