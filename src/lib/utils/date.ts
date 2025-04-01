export const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);

  return normalized;
};

export const toISODateString = (date: Date): string => {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getUTCDate()).padStart(2, "0")}`;
};

export const fromISODateString = (isoString: string): Date => {
  const [year, month, day] = isoString.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
};
