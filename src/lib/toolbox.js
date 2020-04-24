export const toDashCase = (string) =>
  string
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase()
