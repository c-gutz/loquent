"use client" 

import CodeEditor from "../components/code-editor";
import Dictionary from "../components/dictionary";
import { SAMPLE_OUTPUT, SAMPLE_PROGRAM } from "../data/sample-program";
import { useRef, useEffect, useState } from "react";
import type { EditorView } from "@codemirror/view";

declare global {
  function cheerpjInit(options?: Record<string, unknown>): Promise<void>;
  function cheerpjRunLibrary(classPath: string): Promise<any>;
}

// push to github and then vercel, done

// make sure cheerpj init never runs twice
let runtimePromise: Promise<any>| null = null;

function ensureLoquent(): Promise<any> {
  if (!runtimePromise) {
    runtimePromise = (async () => {
      await cheerpjInit({version:17});
      const lib = await cheerpjRunLibrary("/app/loquent.jar");
      const loquent = await lib.loquent.Loquent;
      return loquent;
    })()
  }
  return runtimePromise;
}


export default function Home() {
  const viewRef = useRef<EditorView | null>(null);
  const loquentRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [output, setOutput] = useState(SAMPLE_OUTPUT)

  useEffect(() => {
    let cancelled = false;

    ensureLoquent().then((Loquent) => {
      if (cancelled) return;
      loquentRef.current = Loquent;
      setReady(true);
    });

    return () => { cancelled = true;};  
  }, [])

  
  async function handleRun() {
    const source = viewRef.current?.state.doc.toString() ?? "";
    try {
      const result = await loquentRef.current.runSource(source);
      setOutput(result || "(no output)");
    } catch (e) {
      setOutput(`Interpreter failed: ${e}`);
    }
  }

  return (
    <main className="flex w-full flex-col px-5 pt-4 pb-20 sm:px-8">
      <header className="shrink-0">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-aniline">
          Purple Prose Programming
        </p>
        <h1 className="mt-1.5 font-mono text-[1.75rem] font-semibold leading-none tracking-tight">
          Loquent
        </h1>
        <p className="mt-2 max-w-[42ch] text-sm text-muted">
          A programming language for writers
        </p>
      </header>

      <div className="mt-5 flex min-h-0 flex-col gap-3 lg:mt-6 lg:h-[calc(100dvh-16rem)] lg:min-h-[520px] lg:flex-row">
        <section className="flex h-[62svh] min-h-80 min-w-0 flex-col overflow-hidden rounded-lg border border-edge bg-surface transition-colors focus-within:border-edge-strong lg:h-auto lg:min-h-0 lg:flex-[2]">
          <div className="min-h-0 flex-1">
            <CodeEditor initialDoc={SAMPLE_PROGRAM} onReady={(v) => { viewRef.current = v; }} />
          </div>
        </section>

        <section className="flex h-[38svh] min-h-50 min-w-0 flex-col overflow-hidden rounded-lg border border-edge bg-surface lg:h-auto lg:min-h-0 lg:flex-[1]">
          <div className="min-h-0 flex-1 overflow-auto">
            <pre className="whitespace-pre-wrap px-4 py-4 font-mono text-base leading-6 text-body-strong sm:px-5 sm:text-[0.8125rem]">
              {output}
            </pre>
          </div>
        </section>
      </div>


      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleRun}
          disabled={!ready}
          className="cursor-pointer rounded-md border border-edge bg-surface px-6 py-2.5 font-mono text-sm uppercase tracking-[0.12em] text-chalk transition-colors hover:border-edge-strong hover:bg-wash disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-edge disabled:hover:bg-surface"
        >
          {ready ? "Run" : "Loading…"}
        </button>
      </div>

      <div className="mt-8 sm:mt-10">
        <Dictionary />
      </div>
    </main>
  );
}