export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-black/30 px-4 py-4 text-sm text-white/70">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <p className="m-0">© {currentYear} Klemps. Drink responsibly.</p>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <li>
              <a href="/rules" className="hover:text-white">
                Rules
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-white">
                Privacy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white">
                Terms
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
