export const addTokenToLocalStorage = (Token: string): void => {
  localStorage.setItem("Token", JSON.stringify(Token));
};

export const addProfileToLocalStorage = (src: unknown): void => {
  localStorage.setItem("profile", JSON.stringify(src));
};

export const addProductsToLocalStorage = (product: unknown): void => {
  localStorage.setItem("product", JSON.stringify(product));
};

export const removeTokenFromLocalStorage = (): void => {
  localStorage?.removeItem("Token");
  localStorage?.removeItem("profile");
};

export const removeProfileFromLocalStorage = (): void => {
  localStorage?.removeItem("profile");
};

export const removeProductFromLocalStorage = (): void => {
  localStorage?.removeItem("product");
};

export const getProfileFromLocalStorage = (): unknown => {
  const Token = JSON.parse(localStorage?.getItem("profile") || "null") || "";
  return Token;
};

export const getTokenFromLocalStorage = (): string | null => {
  if (!localStorage?.getItem("Token")) return null;
  const Token = JSON.parse(localStorage?.getItem("Token") || "null") || "";
  return Token;
};

export const getProductsFromLocalStorage = (): unknown[] => {
  const Products = JSON.parse(localStorage?.getItem("product") || "[]") || [];
  return Products;
};

