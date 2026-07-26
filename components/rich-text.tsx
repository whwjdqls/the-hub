import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\*\*.+?\*\*|==.+?==)/g;
  const parts = text.split(pattern);

  return parts.filter(Boolean).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key} className="font-semibold text-[#202023]">{renderInline(part.slice(2, -2), key)}</strong>;
    }
    if (part.startsWith("==") && part.endsWith("==")) {
      return <mark key={key} className="bg-[#fff0a8] px-0.5 text-inherit">{renderInline(part.slice(2, -2), key)}</mark>;
    }
    return part.split("\n").map((line, lineIndex) => (
      <span key={`${key}-line-${lineIndex}`}>
        {lineIndex > 0 && <br />}
        {line}
      </span>
    ));
  });
}

export function RichText({
  body,
  className = "",
}: {
  body: string;
  className?: string;
}) {
  const paragraphs = body.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="mb-5 text-[15px] leading-[1.85] tracking-[-0.005em] text-[#3a3a3e] sm:text-[16px]"
        >
          {renderInline(paragraph, `paragraph-${index}`)}
        </p>
      ))}
    </div>
  );
}
