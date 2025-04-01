import { useState, useMemo } from "react";

import {
  createCalendarMatrix,
  formatMatrixDates,
} from "../utils/createCalendarMatrix";
import { toISODateString } from "../utils/date";

interface MonthCalendarOptions {
  type: string;
  initialDate?: Date;
}

const MonthCalendar = ({ type, initialDate }: MonthCalendarOptions) => {
  if (!type) {
    throw new Error("Calendar type is required");
  }

  const [currentDate, setCurrentDate] = useState(() => {
    if (initialDate) {
      return toISODateString(
        new Date(
          Date.UTC(initialDate.getUTCFullYear(), initialDate.getUTCMonth(), 1)
        )
      );
    }

    const now = new Date();
    return toISODateString(
      new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    );
  });

  const [year, month] = currentDate.split("-").map(Number);

  const calendarMatrix = useMemo(() => {
    return createCalendarMatrix(year, month - 1);
  }, [year, month]);

  const monthCalendarData = useMemo(() => {
    return formatMatrixDates(calendarMatrix.matrix, year, month - 1, type);
  }, [calendarMatrix, type]);

  const moveMonth = (delta: number) => {
    const date = new Date(Date.UTC(year, month - 1 + delta, 1));
    setCurrentDate(toISODateString(date));
  };

  return {
    currentDate,
    setCurrentDate,
    monthCalendarData,
    moveToNext: () => moveMonth(1),
    moveToPrev: () => moveMonth(-1),
    moveToPeriod: moveMonth,
  };
};

export default MonthCalendar;
