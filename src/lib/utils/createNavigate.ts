type NavigateType = "WEEK" | "MONTH";

export const createNavigate = (
  setCurrentDate: (date: (prevData: Date) => Date) => void,
  type: NavigateType
) => {
  const moveToPeriod = (period: number) => {
    setCurrentDate((prevDate: Date) => {
      const newDate = new Date(prevDate);

      switch (type) {
        case "WEEK":
          newDate.setDate(newDate.getDate() + period * 7);
          break;
        case "MONTH":
          newDate.setMonth(newDate.getMonth() + period);
          break;
        default:
          throw new Error("Please check the type.");
      }

      return newDate;
    });
  };

  return {
    moveToPeriod,
    moveToNext: () => moveToPeriod(1),
    moveToPrev: () => moveToPeriod(-1),
  };
};
