import {
  HighlightStyle,
  StreamLanguage,
  type StreamParser,
} from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

const IS_DARK = true;

const CONTROL = new Set([
  "provided",
  "otherwise",
  "through",
  "whilst",
  "yield",
  "aver",
]);
const DECLARATION = new Set(["class", "function", "delineate"]);
const OPERATOR_WORDS = new Set(["and", "or"]);
const LITERALS = new Set(["veritable", "spurious", "inutile"]);
const SELF = new Set(["this", "super"]);

const INDENT_SIZE = 4;

type LoquentState = {
  inString: boolean;
  afterDot: boolean;
  depth: number;
};

const parser: StreamParser<LoquentState> = {
  name: "loquent",

  startState: () => ({ inString: false, afterDot: false, depth: 0 }),

  token(stream, state) {
    // A string left open at the end of a line continues onto the next one.
    if (state.inString) {
      while (!stream.eol()) {
        if (stream.next() === '"') {
          state.inString = false;
          break;
        }
      }
      return "string";
    }

    if (stream.eatSpace()) return null;

    const afterDot = state.afterDot;
    state.afterDot = false;

    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }

    if (stream.match('"')) {
      while (!stream.eol()) {
        if (stream.next() === '"') return "string";
      }
      state.inString = true;
      return "string";
    }

    if (stream.match(/^\d+(\.\d+)?/)) return "number";

    if (stream.match(/^[A-Za-z_][A-Za-z0-9_]*/)) {
      const word = stream.current();
      if (CONTROL.has(word)) return "controlKeyword";
      if (DECLARATION.has(word)) return "declarationKeyword";
      if (OPERATOR_WORDS.has(word)) return "operatorKeyword";
      if (LITERALS.has(word)) return "literal";
      if (SELF.has(word)) return "self";
      if (/^[A-Z]/.test(word)) return "className";
      if (stream.match(/^\s*\(/, false)) return "functionName";
      return afterDot ? "propertyName" : "variableName";
    }

    if (stream.match(/^(==|!=|<=|>=|[-+*/<>=!])/)) return "operator";

    const ch = stream.next();
    if (ch === ".") {
      state.afterDot = true;
      return "punctuation";
    }
    if (ch === "{") {
      state.depth += 1;
      return "punctuation";
    }
    if (ch === "}") {
      state.depth = Math.max(0, state.depth - 1);
      return "punctuation";
    }
    if (ch && "(),;".includes(ch)) return "punctuation";

    return null;
  },

  indent(state, textAfter) {
    const closing = /^\s*\}/.test(textAfter);
    const depth = closing ? Math.max(0, state.depth - 1) : state.depth;
    return depth * INDENT_SIZE;
  },

  languageData: {
    commentTokens: { line: "//" },
    indentOnInput: /^\s*\}$/,
    closeBrackets: { brackets: ["(", "{", '"'] },
  },

  tokenTable: {
    controlKeyword: t.controlKeyword,
    declarationKeyword: t.definitionKeyword,
    operatorKeyword: t.operatorKeyword,
    literal: t.atom,
    self: t.self,
    className: t.className,
    functionName: t.function(t.variableName),
    propertyName: t.propertyName,
    variableName: t.variableName,
    string: t.string,
    number: t.number,
    comment: t.lineComment,
    operator: t.operator,
    punctuation: t.punctuation,
  },
};

export const loquentLanguage = StreamLanguage.define(parser);

export const loquentHighlight = HighlightStyle.define([
  { tag: t.controlKeyword, color: "var(--syn-keyword)" },
  { tag: t.operatorKeyword, color: "var(--syn-keyword)" },
  { tag: t.definitionKeyword, color: "var(--syn-keyword-decl)" },
  { tag: t.string, color: "var(--syn-string)" },
  { tag: t.atom, color: "var(--syn-literal)" },
  { tag: t.number, color: "var(--syn-literal)" },
  { tag: t.function(t.variableName), color: "var(--syn-function)" },
  { tag: t.className, color: "var(--syn-class)" },
  { tag: t.comment, color: "var(--syn-comment)", fontStyle: "italic" },
  { tag: t.operator, color: "var(--syn-punctuation)" },
  { tag: t.punctuation, color: "var(--syn-punctuation)" },
  // Left at body color on purpose; give these a hue if it reads as too quiet.
  { tag: t.self, color: "var(--syn-text)" },
  { tag: t.propertyName, color: "var(--syn-text)" },
  { tag: t.variableName, color: "var(--syn-text)" },
]);

export const loquentEditorTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      color: "var(--syn-text)",
      backgroundColor: "transparent",
      fontSize: "0.8125rem",
    },
    "&.cm-focused": { outline: "none" },
    ".cm-content:focus-visible": { outline: "none" },
    ".cm-scroller": {
      fontFamily: "var(--font-mono)",
      lineHeight: "1.5rem",
      padding: "1rem 0",
      overflow: "auto",
    },
    ".cm-content": {
      padding: 0,
      caretColor: "var(--color-aniline)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-surface)",
      borderRight: "none",
      color: "var(--syn-gutter)",
      paddingLeft: "1rem",
      paddingRight: "0.875rem",
      userSelect: "none",
    },
    ".cm-activeLine, .cm-activeLineGutter": {
      backgroundColor: "transparent",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "var(--color-aniline)",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: "color-mix(in oklab, var(--color-aniline) 26%, transparent)",
      },
    ".cm-matchingBracket, &.cm-focused .cm-matchingBracket": {
      backgroundColor: "color-mix(in oklab, var(--color-aniline) 24%, transparent)",
      color: "inherit",
      outline: "none",
    },
    // Keeps iOS from zooming the viewport when the editor takes focus.
    "@media (max-width: 639px)": {
      "&": { fontSize: "1rem" },
      ".cm-scroller": { padding: "0.875rem 0" },
      ".cm-gutters": { paddingLeft: "0.875rem", paddingRight: "0.75rem" },
    },
  },
  { dark: IS_DARK },
);