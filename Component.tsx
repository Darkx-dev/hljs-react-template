"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import parse, { domToReact } from "html-react-parser";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Light theme
import "highlight.js/styles/github-dark.css"; // Dark theme
import CopyButton from "./CopyButton";

const Content = ({ content }: { content: string }) => {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll("pre");
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [content, theme]);

  const sanitizedHtml = content;

  const wrapPreBlocks = (node: any) => {
    if (node.type === "tag" && node.name === "pre") {
      const code = node.children[0].data;
      console.log(domToReact(node.children));
      return (
        <>
          <div className="code-block-wrapper overflow-auto">
            <CopyButton code={code} />
            <pre>{domToReact(node.children)}</pre>
          </div>
        </>
      );
    }
  };

  return (
    <div
      id="content-viewer"
      ref={contentRef}
      className={`hljs ${mounted && theme} w-full overflow-x-auto`}
    >
      {parse(sanitizedHtml, { replace: wrapPreBlocks })}
    </div>
  );
};

export default Content;
