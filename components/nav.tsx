const link =
  "relative py-1 font-mono text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-chalk " +
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 " +
  "after:bg-chalk after:transition-transform after:duration-300 after:ease-out after:content-[''] " +
  "hover:after:scale-x-100 sm:text-sm sm:tracking-[0.16em]";

export default function Nav() {
  return (
    <header className="w-full border-b border-edge bg-black">
      <nav
        aria-label="Main"
        className="flex h-14 items-center justify-center gap-5 px-5 sm:h-16 sm:gap-14 sm:px-8"
      >
        <a href="/" className={link}>
          Playground
        </a>
        <a href="/about" className={link}>
          About
        </a>
        <a href="/contact" className={link}>
          Contact
        </a>
      </nav>
    </header>
  );
}