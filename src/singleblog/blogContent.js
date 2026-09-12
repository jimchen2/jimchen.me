import React from "react";
import parse from "html-react-parser";
import CodeBlock from "./codeBlock";

/**
 * Recursively pulls the text out of a parsed node. Used to recover the exact
 * source of a code block, with HTML entities already decoded by the parser.
 */
function getTextContent(node) {
  if (!node) return "";
  if (node.type === "text") return node.data ?? "";
  if (node.type === "comment") return "";
  if (!node.children) return "";
  return node.children.map(getTextContent).join("");
}

function replaceNode(domNode) {
  // ```lang ... ``` blocks arrive as <pre><code class="language-lang">
  if (domNode.name === "pre") {
    const codeNode = (domNode.children || []).find((child) => child.name === "code");
    const source = getTextContent(codeNode || domNode).replace(/\n$/, "");
    const className = codeNode?.attribs?.class || domNode.attribs?.class || "";
    const languageMatch = /language-([\w+#-]+)/.exec(className);

    return <CodeBlock code={source} language={languageMatch?.[1] || null} />;
  }

  // KaTeX output, rendered on the server and stashed in a data attribute so it
  // never has to travel back through the HTML parser.
  if (
    domNode.name === "span" &&
    domNode.attribs?.["data-math-html"] !== undefined
  ) {
    return (
      <span
        className="math-slot"
        dangerouslySetInnerHTML={{ __html: domNode.attribs["data-math-html"] }}
      />
    );
  }

  return undefined; // keep the default rendering
}

export default function BlogContent({ html }) {
  const elements = parse(html || "", { replace: replaceNode });
  return <>{elements}</>;
}
