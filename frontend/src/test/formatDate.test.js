import { formatDate } from "../utils/formatDate";

describe("formatDate", () => {
  it("форматирует валидную дату на русском", () => {
    const result = formatDate("2024-01-15");
    // Проверяем что в строке есть год и ключевые части — не привязываемся к точному формату
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/январ/i);
    expect(result).toMatch(/15/);
  });

  it('возвращает "—" для пустой строки', () => {
    expect(formatDate("")).toBe("—");
  });

  it('возвращает "—" для null', () => {
    expect(formatDate(null)).toBe("—");
  });

  it('возвращает "—" для undefined', () => {
    expect(formatDate(undefined)).toBe("—");
  });

  it("возвращает исходную строку если дата не парсится", () => {
    // Мокируем Date чтобы toLocaleDateString бросил ошибку
    const original = global.Date;
    global.Date = class extends original {
      toLocaleDateString() {
        throw new Error("parse error");
      }
    };
    expect(formatDate("not-a-date")).toBe("not-a-date");
    global.Date = original;
  });
});
