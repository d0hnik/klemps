import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  title: string;
  borderColor?: string;
  children: ReactNode;
  footer: ReactNode;
};

export function GameModal({ title, borderColor = "var(--color-panel)", children, footer }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    dialogRef.current?.querySelector("h2")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => event.preventDefault()}
      className="m-auto max-h-[90dvh] w-11/12 max-w-lg border-0 bg-transparent p-0 text-white backdrop:bg-black/75"
    >
      <div
        className="secondary-pixel-corners flex max-h-[90dvh] flex-col bg-[var(--color-dark-bg)] p-4 sm:p-6"
        style={{ "--border-color": borderColor } as CSSProperties}
      >
        <h2 id={titleId} tabIndex={-1} className="mb-4 shrink-0 text-center text-3xl text-amber-200 outline-none">{title}</h2>
        <div
          role="region"
          aria-labelledby={titleId}
          tabIndex={0}
          className="min-h-0 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#f6c453 transparent" }}
        >{children}</div>
        <div className="mt-4 shrink-0 border-t border-white/10 pt-4">{footer}</div>
      </div>
    </dialog>
  );
}
