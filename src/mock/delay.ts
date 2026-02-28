export const simulateDelay = (ms = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
