
export const wPx2P = function wPx2P(px) {
  return px / 375 * SCREEN_WIDTH; // design for height 375
};

export const hPx2P = function hPx2P(px) {
  return px / 667 * SCREEN_HEIGHT; // design for height 667
};
