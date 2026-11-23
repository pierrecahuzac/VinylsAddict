import { type ReactNode } from "react";
import cguMarkdown from "../../content/CGU.md?raw";

const renderInline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );

const CGU = () => {
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(
      <p
        key={`p-${key++}`}
        className="text-sm leading-relaxed text-gray-400"
      >
        {renderInline(paragraph.join(" "))}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul
        key={`ul-${key++}`}
        className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-400"
      >
        {listItems.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const rawLine of cguMarkdown.split("\n")) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith("---")) {
      flushParagraph();
      flushList();
      blocks.push(<hr key={`hr-${key++}`} className="border-white/10" />);
      continue;
    }
    if (line.startsWith("#### ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4 key={`h4-${key++}`} className="text-base font-bold text-white">
          {line.slice(5)}
        </h4>,
      );
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={`h3-${key++}`} className="text-lg font-bold text-white">
          {line.slice(4)}
        </h3>,
      );
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2
          key={`h2-${key++}`}
          className="text-xl font-bold text-white border-b border-white/10 pb-2 mt-2"
        >
          {line.slice(3)}
        </h2>,
      );
      continue;
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      // Le titre du document est déjà affiché dans l'en-tête de la page.
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <aside
          key={`note-${key++}`}
          className="rounded-xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 p-4 text-xs text-gray-300"
        >
          {renderInline(line.slice(2))}
        </aside>,
      );
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2));
      continue;
    }

    flushList();
    paragraph.push(line);
  }
  flushParagraph();
  flushList();

  return (
    <div className="p-4 pb-10 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-black tracking-tight text-white">
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-sm text-gray-500">Vinyls Addict</p>
      </header>

      <div className="space-y-4">{blocks}</div>
    </div>
  );
};

export default CGU;
