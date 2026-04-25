import { getInitials } from "../utils/getInitials";

describe("getInitials", () => {
  it("возвращает инициалы из имени и фамилии", () => {
    expect(getInitials("Иван", "Петров")).toBe("ИП");
  });

  it("возвращает заглавные буквы", () => {
    expect(getInitials("john", "doe")).toBe("JD");
  });

  it("возвращает только первую букву если фамилия отсутствует", () => {
    expect(getInitials("Иван", "")).toBe("И");
    expect(getInitials("Иван", null)).toBe("И");
    expect(getInitials("Иван", undefined)).toBe("И");
  });

  it("возвращает только первую букву если имя отсутствует", () => {
    expect(getInitials("", "Петров")).toBe("П");
    expect(getInitials(null, "Петров")).toBe("П");
  });

  it('возвращает "U" если оба поля пустые', () => {
    expect(getInitials("", "")).toBe("U");
    expect(getInitials(null, null)).toBe("U");
    expect(getInitials(undefined, undefined)).toBe("U");
  });
});
