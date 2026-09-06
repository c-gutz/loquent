export type DictionaryEntry = {
  loquent: string;
  java: string;
  tone: "keyword" | "keyword-decl" | "literal";
};

export const DICTIONARY: DictionaryEntry[] = [
  { loquent: "aver", java: "System.out.println", tone: "keyword" },
  { loquent: "delineate", java: "var", tone: "keyword-decl" },
  { loquent: "provided", java: "if", tone: "keyword" },
  { loquent: "otherwise", java: "else", tone: "keyword" },
  { loquent: "whilst", java: "while", tone: "keyword" },
  { loquent: "through", java: "for", tone: "keyword" },
  { loquent: "yield", java: "return", tone: "keyword" },
  { loquent: "veritable", java: "true", tone: "literal" },
  { loquent: "spurious", java: "false", tone: "literal" },
  { loquent: "inutile", java: "null", tone: "literal" },
];