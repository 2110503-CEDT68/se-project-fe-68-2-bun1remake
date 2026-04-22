import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function PrivacyPolicy() {
  // 1. Get the path to the markdown file
  const filePath = path.join(
    process.cwd(),
    "public",
    "content",
    "privacy-policy.md",
  );

  // 2. Read the file content
  const fileContent = fs.readFileSync(filePath, "utf8");

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <div className="prose prose-slate lg:prose-xl">
        {/* 3. Render the Markdown */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Headings
            h1: ({ ...props }) => (
              <h1
                className="font-figma-display text-5xl font-bold text-[var(--figma-red)] mb-10 border-b border-[var(--figma-red-soft)] pb-6"
                {...props}
              />
            ),
            h2: ({ ...props }) => (
              <h2
                className="font-figma-display text-3xl font-semibold text-[var(--figma-red-strong)] mt-12 mb-4 uppercase tracking-wide"
                {...props}
              />
            ),
            h3: ({ ...props }) => (
              <h3
                className="font-figma-display text-2xl font-medium text-[var(--figma-ink)] mt-8 mb-3 italic"
                {...props}
              />
            ),

            // Use "Cormorant Infant" for body copy
            p: ({ ...props }) => (
              <p
                className="font-figma-copy text-[1.4rem] leading-relaxed text-[var(--figma-ink-soft)] mb-6"
                {...props}
              />
            ),

            // Lists with ink color
            ul: ({ ...props }) => (
              <ul
                className="list-disc list-outside ml-8 mb-8 space-y-3 text-[1.3rem] text-[var(--figma-ink-soft)]"
                {...props}
              />
            ),
            li: ({ ...props }) => <li className="pl-2" {...props} />,

            // Links use "figma-link" logic
            a: ({ ...props }) => (
              <a
                className="figma-link font-figma-nav !text-[var(--figma-red)] font-bold border-b border-[var(--figma-red-soft)] hover:border-[var(--figma-red-strong)] transition-all"
                {...props}
              />
            ),

            // Use "figma-feedback" style for blockquotes
            blockquote: ({ ...props }) => (
              <blockquote
                className="figma-feedback italic bg-[var(--figma-soft)] border-l-4 border-[var(--figma-red)] my-8 text-[1.2rem]"
                {...props}
              />
            ),

            hr: () => (
              <hr className="my-12 border-t border-[var(--figma-red-soft)] opacity-30" />
            ),
          }}
        >
          {fileContent}
        </ReactMarkdown>
      </div>
    </main>
  );
}
