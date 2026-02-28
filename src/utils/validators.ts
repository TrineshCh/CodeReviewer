export const isValidGitHubUrl = (url: string): boolean => {
  const pattern = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/;
  return pattern.test(url);
};

export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
