import {
  getLanguage,
  getLanguageDisplayName,
} from "../components/markdown/languageMap";

describe("getLanguage", () => {
  it("извлекает язык из className", () => {
    expect(getLanguage("language-javascript")).toBe("javascript");
    expect(getLanguage("language-python")).toBe("python");
    expect(getLanguage("language-tsx")).toBe("tsx");
  });

  it('возвращает "text" если className пустой', () => {
    expect(getLanguage("")).toBe("text");
    expect(getLanguage(undefined)).toBe("text");
  });

  it('возвращает "text" если язык не найден в className', () => {
    expect(getLanguage("some-other-class")).toBe("text");
  });
});

describe("getLanguageDisplayName", () => {
  it("возвращает читаемое название для известных языков", () => {
    expect(getLanguageDisplayName("js")).toBe("JavaScript");
    expect(getLanguageDisplayName("javascript")).toBe("JavaScript");
    expect(getLanguageDisplayName("ts")).toBe("TypeScript");
    expect(getLanguageDisplayName("py")).toBe("Python");
    expect(getLanguageDisplayName("python")).toBe("Python");
    expect(getLanguageDisplayName("yml")).toBe("YAML");
    expect(getLanguageDisplayName("yaml")).toBe("YAML");
    expect(getLanguageDisplayName("dockerfile")).toBe("Docker");
  });

  it("возвращает язык в верхнем регистре для неизвестных", () => {
    expect(getLanguageDisplayName("elixir")).toBe("ELIXIR");
    expect(getLanguageDisplayName("unknown")).toBe("UNKNOWN");
  });
});
