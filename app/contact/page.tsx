export default function Contact() {
  return (
    <main className="px-6 py-20 sm:py-28">
      <div className="w-full mx-auto max-w-xl">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
          Contact
        </p>

        <h1 className="mt-4 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
          Get in touch
        </h1>

        <dl className="mt-12 divide-y divide-edge border-y border-edge">
          <div className="flex items-baseline justify-between gap-6 py-6">
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
              Name
            </dt>
            <dd className="text-sm sm:text-base">Christian Gutierrez</dd>
          </div>

          <div className="flex items-baseline justify-between gap-6 py-6">
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
              University
            </dt>
            <dd className="text-right text-sm sm:text-base">Stanford University</dd>
          </div>

          <div className="flex items-baseline justify-between gap-6 py-6">
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
              Email
            </dt>
            <dd className="text-sm sm:text-base">
              <a href="mailto:cgutz@stanford.edu" className="relative inline-block text-chalk after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-chalk after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100">
                cgutz [at] stanford [dot] edu
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}