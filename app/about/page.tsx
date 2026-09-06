export default function About() {
  return (
    <main className="px-6 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-xl">
        <header>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
            About
          </p>

          <h1 className="mt-4 font-mono text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Project Overview
          </h1>

           <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            For more information and project files, see the GitHub repo at{" "}
            <a
              href="https://github.com/c-gutz/loquent"
              target="_blank"
              rel="noreferrer"
              className="relative inline-block after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100"
            >
              https://github.com/c-gutz/loquent
            </a>
            .
           </p>

        </header>

        <article
          className="mt-12 border-t border-edge pt-12
                  [&>h2]:mt-14 [&>h2]:font-mono [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:tracking-tight
                  [&>h3]:mt-9 [&>h3]:font-mono [&>h3]:text-[0.9375rem] [&>h3]:font-semibold [&>h3]:tracking-tight
                  [&>p]:mt-6 [&>p]:text-[0.9375rem] [&>p]:leading-[1.75] [&>p]:text-chalk/70
                  sm:[&>p]:text-base
                  [&>*:first-child]:mt-0
                  [&_a]:underline [&_a]:decoration-white/25 [&_a]:underline-offset-4
                  [&_a:hover]:decoration-[--color-chalk]
                  [&_code]:font-mono [&_code]:text-[0.875em] [&_code]:text-aniline
                  [&_strong]:font-semibold [&_strong]:text-chalk
                  [&>ul]:mt-6 [&>ul]:space-y-2.5 [&>ul]:text-[0.9375rem] [&>ul]:leading-[1.75] [&>ul]:text-chalk/70
                  sm:[&>ul]:text-base
                  [&>ul>li]:relative [&>ul>li]:pl-6
                  [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[0.7em]
                  [&>ul>li]:before:h-1 [&>ul>li]:before:w-1 [&>ul>li]:before:bg-white/30 [&>ul>li]:before:content-['']"
        >
          <p>
            Loquent is a tree-walking interpreter that I created in 2025 by following Robert Nystrom's great guide, "Crafting
            Interpreters."
          </p>

          <p>
            Implemented in Java, this project served as both my introduction to designing programming languages and Java itself.
          </p>
           
          <p>
            Loquent, like the language in Nystrom's book, is quite functional and well-featured, except for some edge cases. It
            includes functions, classes, inheritance, and all the basics.
          </p>

          <p>
            As a personal twist, to reflect my interest in historical fiction, I changed the syntax to resemble the verbosity
            often found in classic novels. I recognize that this makes the language a bit unusable, but I do think it is funny.
            A dictionary can be found at the bottom of the Playground page for specifics.
          </p>

          <p> 
            This site is a simple static page that uses Cheerpj to run the Java-based language directly in the browser without 
            any reimplementation or backend. This is possible through a WebAssembly JVM. The IDE look is to the credit 
            of CodeMirror.
          </p>
        </article>
      </div>
    </main>
  );
}