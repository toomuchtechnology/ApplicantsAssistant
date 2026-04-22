import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { useTheme } from "../providers/theme-provider";

const fixTextCodeBlocks = (content) => {
  if (!content) return content;
  if (typeof content !== "string") {
    content = JSON.stringify(content, null, 2);
  }
  let fixed = content.replace(/(?<!`)`([^`\n]+)`(?!`)/g, "**$1**");
  return fixed;
};

export const SimpleMarkdownContent = ({
  content,
  className = "",
  compact = false,
  theme: themeProp = "auto",
}) => {
  const { theme: contextTheme } = useTheme?.() || { theme: undefined };
  const [mounted, setMounted] = useState(false);
  const [copyStatus, setCopyStatus] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!content) return null;

  const processedContent = useMemo(() => {
    return fixTextCodeBlocks(content);
  }, [content]);

  const currentTheme = useMemo(() => {
    if (themeProp !== "auto") return themeProp;
    if (contextTheme) return contextTheme;

    if (mounted) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }, [themeProp, contextTheme, mounted]);

  const isDarkMode = currentTheme === "dark";

  const codeStyle = useMemo(() => {
    return isDarkMode ? vscDarkPlus : vs;
  }, [isDarkMode]);

  const copyToClipboard = async (text, language) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus((prev) => ({ ...prev, [language]: "Скопировано!" }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [language]: "Копировать" }));
      }, 2000);
    } catch (err) {
      setCopyStatus((prev) => ({ ...prev, [language]: "Ошибка" }));
      console.error("Ошибка копирования:", err);
    }
  };

  const styles = compact
    ? {
        h1: "text-xl font-bold mt-6 mb-4 text-gray-900 dark:text-white",
        h2: "text-lg font-semibold mt-5 mb-3 text-gray-800 dark:text-gray-200",
        h3: "text-base font-medium mt-4 mb-2 text-gray-700 dark:text-gray-300",
        h4: "text-sm font-medium mt-3 mb-2 text-gray-600 dark:text-gray-400",
        p: "mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300",
        spacing: "space-y-1.5",
        blockquote:
          "my-4 pl-3 border-l-3 border-blue-400 bg-blue-50/20 dark:bg-blue-900/10 py-2 text-sm",
      }
    : {
        h1: "text-2xl font-bold mt-8 mb-6 text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700",
        h2: "text-xl font-semibold mt-7 mb-4 text-gray-800 dark:text-gray-200 relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-gradient-to-b before:from-blue-500 before:to-purple-500 before:rounded-full",
        h3: "text-lg font-medium mt-6 mb-3 text-gray-700 dark:text-gray-300",
        h4: "text-base font-medium mt-5 mb-2 text-gray-600 dark:text-gray-400",
        p: "mb-4 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300",
        spacing: "space-y-2",
        blockquote:
          "my-5 pl-4 border-l-4 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-gray-800/30 dark:to-gray-900/30 py-3 rounded-r-lg italic text-gray-600 dark:text-gray-400",
      };

  const getLanguage = (className = "") => {
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : "text";
  };

  const getLanguageDisplayName = (language) => {
    const languageMap = {
      js: "JavaScript",
      javascript: "JavaScript",
      ts: "TypeScript",
      typescript: "TypeScript",
      jsx: "JSX",
      tsx: "TSX",
      python: "Python",
      py: "Python",
      html: "HTML",
      css: "CSS",
      scss: "SCSS",
      sass: "SASS",
      json: "JSON",
      md: "Markdown",
      markdown: "Markdown",
      bash: "Bash",
      sh: "Shell",
      shell: "Shell",
      sql: "SQL",
      java: "Java",
      cpp: "C++",
      c: "C",
      go: "Go",
      rust: "Rust",
      php: "PHP",
      ruby: "Ruby",
      yaml: "YAML",
      yml: "YAML",
      dockerfile: "Docker",
      docker: "Docker",
      graphql: "GraphQL",
      xml: "XML",
    };

    return languageMap[language] || language.toUpperCase();
  };

  return (
    <div
      className={`${className} ${compact ? "" : "prose prose-sm max-w-none dark:prose-invert"}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => <h1 className={styles.h1}>{children}</h1>,
          h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
          h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
          h4: ({ children }) => <h4 className={styles.h4}>{children}</h4>,
          h5: ({ children }) => (
            <h5 className="text-sm font-medium mt-4 mb-2 text-gray-600 dark:text-gray-400">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium mt-3 mb-1 text-gray-500 dark:text-gray-500">
              {children}
            </h6>
          ),

          p: ({ children }) => <p className={styles.p}>{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-600 dark:text-gray-400">
              {children}
            </em>
          ),
          del: ({ children }) => (
            <del className="line-through text-gray-400 dark:text-gray-500">
              {children}
            </del>
          ),

          ul: ({ children }) => (
            <ul className={`mb-4 ml-5 list-disc ${styles.spacing}`}>
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className={`mb-4 ml-5 list-decimal ${styles.spacing}`}>
              {children}
            </ol>
          ),

          li: ({ children, ...props }) => {
            // Task list items already have their own checkbox rendering via `input`,
            // so we check if this li contains a checkbox to apply different alignment
            const isTask = props?.className?.includes("task-list-item");

            return (
              <li
                className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${
                  isTask ? "flex items-start gap-2 list-none" : "ml-1 pl-1"
                }`}
              >
                {children}
              </li>
            );
          },

          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const language = getLanguage(className);
            const displayName = getLanguageDisplayName(language);
            const codeString = String(children).replace(/\n$/, "");

            return mounted ? (
              <div className="my-5 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {displayName}
                    </span>
                  </div>
                  <button
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
                    onClick={() => copyToClipboard(codeString, language)}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    {copyStatus[language] || "Копировать"}
                  </button>
                </div>
                <SyntaxHighlighter
                  language={language}
                  style={codeStyle}
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    fontSize: "0.875rem",
                    backgroundColor: isDarkMode ? "#1a202c" : "#ffffff",
                    overflowX: "auto",
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{
                    minWidth: "3em",
                    paddingRight: "1em",
                    textAlign: "right",
                    color: isDarkMode ? "#718096" : "#a0aec0",
                    borderRight: "1px solid",
                    borderRightColor: isDarkMode ? "#2d3748" : "#e2e8f0",
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="my-5 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {displayName}
                  </span>
                </div>
                <pre className="p-4 overflow-x-auto bg-white dark:bg-gray-900 m-0">
                  <code className={`text-sm font-mono ${className}`}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },

          blockquote: ({ children }) => (
            <blockquote className={styles.blockquote}>{children}</blockquote>
          ),

          hr: () => (
            <hr className="my-6 border-t border-gray-300 dark:border-gray-700 opacity-50" />
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium underline decoration-2 decoration-blue-300/30 hover:decoration-blue-400/50 transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          img: ({ src, alt }) => (
            <div className="my-6 flex justify-center">
              <div className="relative group">
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md group-hover:shadow-lg transition-shadow duration-300"
                  loading="lazy"
                />
                {alt && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg">
                    {alt}
                  </div>
                )}
              </div>
            </div>
          ),

          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
              {children}
            </td>
          ),

          input: ({ checked, type }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked || false}
                  readOnly
                  className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                />
              );
            }
            return null;
          },
          taskList: ({ children }) => (
            <ul className="space-y-3 my-4">{children}</ul>
          ),
          taskListItem: ({ children, checked }) => (
            <li className="flex items-start">
              <div
                className={`flex items-center h-5 mt-0.5 mr-3 ${checked ? "text-green-500" : "text-gray-400"}`}
              >
                {checked ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm ${checked ? "text-gray-500 dark:text-gray-500 line-through" : "text-gray-700 dark:text-gray-300"}`}
              >
                {children}
              </span>
            </li>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
