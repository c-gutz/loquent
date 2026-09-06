"use client";

import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, drawSelection, highlightSpecialChars } from "@codemirror/view";
import { bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { loquentEditorTheme, loquentHighlight, loquentLanguage } from "../app/loquent-language";

type Props = {
  initialDoc : string,
  onReady?: (view : EditorView) => void
}

export default function CodeEditor({ initialDoc, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const parent = host.current;
    if (!parent) return;

    const view = new EditorView({
      doc: initialDoc,
      parent,
      extensions: [
        lineNumbers(),
        history(),
        drawSelection(),
        highlightSpecialChars(),
        bracketMatching(),
        indentOnInput(),
        indentUnit.of("    "),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        loquentLanguage,
        syntaxHighlighting(loquentHighlight),
        loquentEditorTheme,
      ],
    });

    onReadyRef.current?.(view);

    return () => view.destroy();
    // mounts once; the document is the editor's own state after this point
  }, []);

  return <div ref={host} className="h-full min-h-0 overflow-hidden" />;
}