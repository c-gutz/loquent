import { DICTIONARY } from "../data/dictionary-data";

const TONE_COLOR: Record<string, string> = {
  keyword: "text-[--syn-keyword]",
  "keyword-decl": "text-[--syn-keyword-decl]",
  literal: "text-[--syn-literal]",
};

export default function Dictionary() {
  return (
    <section className="border-t border-edge pt-10 sm:pt-12">
      <h2 className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-muted">
        Dictionary
      </h2>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 sm:gap-y-6 lg:grid-cols-5">
                {DICTIONARY.map(({ loquent, java, tone }) => (
          <div key={loquent}>
            <dt className={`font-mono text-sm ${TONE_COLOR[tone]}`}>{loquent}</dt>
            <dd className="mt-1 font-mono text-xs text-muted">{java}</dd>
          </div>
        ))}
      </dl>

    </section>
  );
}