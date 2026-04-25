import {
  isTokenExpiredOrExpiring,
  getValidToken,
  parseToken,
} from "../utils/tokenUtils";

// Создаёт минимальный JWT с нужным exp
const makeToken = (expOffsetMs) => {
  const payload = { exp: Math.floor((Date.now() + expOffsetMs) / 1000) };
  const encoded = btoa(JSON.stringify(payload));
  return `header.${encoded}.signature`;
};

describe("parseToken", () => {
  it("возвращает payload для валидного токена", () => {
    const token = makeToken(60_000);
    const result = parseToken(token);
    expect(result).toHaveProperty("exp");
  });

  it("возвращает null для пустой строки", () => {
    expect(parseToken("")).toBeNull();
  });

  it("возвращает null для невалидного токена", () => {
    expect(parseToken("not.a.token")).toBeNull();
  });

  it("возвращает null для undefined", () => {
    expect(parseToken(undefined)).toBeNull();
  });
});

describe("isTokenExpiredOrExpiring", () => {
  it("возвращает false для свежего токена", () => {
    const token = makeToken(60 * 60 * 1000); // истекает через час
    expect(isTokenExpiredOrExpiring(token)).toBe(false);
  });

  it("возвращает true для истёкшего токена", () => {
    const token = makeToken(-1000); // истёк секунду назад
    expect(isTokenExpiredOrExpiring(token)).toBe(true);
  });

  it("возвращает true если токен истекает в пределах буфера (5 мин по умолчанию)", () => {
    const token = makeToken(2 * 60 * 1000); // истекает через 2 минуты
    expect(isTokenExpiredOrExpiring(token)).toBe(true);
  });

  it("возвращает false если токен истекает за пределами кастомного буфера", () => {
    const token = makeToken(10 * 60 * 1000); // истекает через 10 минут
    expect(isTokenExpiredOrExpiring(token, 5 * 60 * 1000)).toBe(false);
  });

  it("возвращает true для null", () => {
    expect(isTokenExpiredOrExpiring(null)).toBe(true);
  });

  it("возвращает true для невалидного токена", () => {
    expect(isTokenExpiredOrExpiring("garbage")).toBe(true);
  });
});

describe("getValidToken", () => {
  beforeEach(() => localStorage.clear());

  it("возвращает токен если он свежий", () => {
    const token = makeToken(60 * 60 * 1000);
    localStorage.setItem("jwt_token", token);
    expect(getValidToken()).toBe(token);
  });

  it("возвращает null если токен истёк", () => {
    const token = makeToken(-1000);
    localStorage.setItem("jwt_token", token);
    expect(getValidToken()).toBeNull();
  });

  it("возвращает null если токена нет", () => {
    expect(getValidToken()).toBeNull();
  });
});
