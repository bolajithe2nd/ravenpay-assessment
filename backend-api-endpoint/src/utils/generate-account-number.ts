function generateAccountNumber(): string {
  const firstDigit = Math.floor(1 + Math.random() * 9);
  const remainingDigits = Array.from({ length: 10 - 1 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  return `${firstDigit}${remainingDigits}`;
}

export { generateAccountNumber };
