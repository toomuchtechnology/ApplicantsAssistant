export const LANGUAGE_MAP = {
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
  csharp: "C#",
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

/** "language-js" → "js" */
export const getLanguage = (className = "") => {
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "text";
};

/** "js" → "JavaScript" */
export const getLanguageDisplayName = (language) =>
  LANGUAGE_MAP[language] || language.toUpperCase();
