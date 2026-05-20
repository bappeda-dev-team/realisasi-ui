export const formatPercentageText = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "-";
  }

  const text = String(value);

  return text.replace(/(\d+(?:\.(\d+))?)(%)?/g, (_match: string, numberPart: string, decimalPart: string | undefined, percentSign: string | undefined) => {
    if (decimalPart === undefined) {
      return numberPart + (percentSign || "");
    }

    const trimmedDecimal = decimalPart.replace(/0+$/, "");

    if (trimmedDecimal.length === 0) {
      return numberPart.split('.')[0] + (percentSign || "");
    }

    if (trimmedDecimal.length >= 3) {
      const num = Number(numberPart);
      const rounded = Math.round(num * 10) / 10;
      return String(rounded) + (percentSign || "");
    }

    return numberPart.split('.')[0] + "." + trimmedDecimal + (percentSign || "");
  });
};
