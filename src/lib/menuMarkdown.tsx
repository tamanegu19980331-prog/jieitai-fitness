import { Fragment } from "react";

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong
          key={`${keyPrefix}-bold-${i}`}
          className="font-bold text-[#e8f0e4]"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={`${keyPrefix}-text-${i}`}>{part}</Fragment>;
  });
}

export function MenuMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;

    blocks.push(
      <ul key={`list-${key++}`} className="my-2 space-y-1.5">
        {listItems.map((item, i) => (
          <li key={i} className="flex gap-2 leading-relaxed">
            <span className="mt-0.5 shrink-0 text-[#5a9a5a]">■</span>
            <span>{renderInline(item, `li-${i}`)}</span>
          </li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    flushList();

    if (trimmed === "") {
      blocks.push(<div key={`space-${key++}`} className="h-2" />);
      continue;
    }

    blocks.push(
      <p key={`p-${key++}`} className="my-1 leading-relaxed">
        {renderInline(trimmed, `p-${key}`)}
      </p>,
    );
  }

  flushList();

  return <div>{blocks}</div>;
}

export function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/#/g, "")
    .replace(/^\s*-\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
