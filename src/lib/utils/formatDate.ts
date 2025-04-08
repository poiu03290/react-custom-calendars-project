export const formatDate = (date: Date, format: string): string => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  let result = format;

  // Replace in order from longest to shortest to avoid partial matches
  if (format.includes("yyyy")) {
    result = result.replace("yyyy", year.toString());
  }
  if (format.includes("MM")) {
    result = result.replace("MM", month.toString().padStart(2, "0"));
  }
  if (format.includes("dd")) {
    result = result.replace("dd", day.toString().padStart(2, "0"));
  }

  return result;
};
