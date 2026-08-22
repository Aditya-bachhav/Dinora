export const cartKey = (tableToken) => `dinora-cart-${tableToken}`;

export const readCart = (tableToken) => {
  try { return JSON.parse(localStorage.getItem(cartKey(tableToken)) || '[]'); }
  catch { return []; }
};

export const writeCart = (tableToken, cart) => localStorage.setItem(cartKey(tableToken), JSON.stringify(cart));
