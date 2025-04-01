import { useState, useMemo } from "react";
import {
  createCalendarMatrix,
  formatMatrixDates,
  getWeekFromMatrix,
} from "../utils/createCalendarMatrix";
import { toISODateString } from "../utils/date";

interface WeekCalendarOptions {
  type: string;
  initialDate?: Date;
}

const WeekCalendar = ({ type, initialDate }: WeekCalendarOptions) => {
  if (!type) {
    throw new Error("Calendar type is required");
  }

  const [currentDate, setCurrentDate] = useState(() => {
    if (initialDate) {
      return toISODateString(
        new Date(
          Date.UTC(
            initialDate.getUTCFullYear(),
            initialDate.getUTCMonth(),
            initialDate.getUTCDate()
          )
        )
      );
    }

    const now = new Date();
    return toISODateString(
      new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      )
    );
  });

  const [year, month, day] = currentDate.split("-").map(Number);

  const {
    matrix,
    year: matrixYear,
    month: matrixMonth,
    prevMonthDates,
    nextMonthDates,
  } = useMemo(() => {
    return createCalendarMatrix(year, month - 1, true);
  }, [year, month]);

  const weekDates = useMemo(() => {
    return getWeekFromMatrix(
      matrix,
      year,
      month - 1,
      day,
      prevMonthDates,
      nextMonthDates,
      type
    );
  }, [matrix, year, month, day, prevMonthDates, nextMonthDates, type]);

  const monthlyWeekGrid = useMemo(() => {
    return formatMatrixDates(
      matrix,
      matrixYear,
      matrixMonth,
      type,
      true,
      prevMonthDates,
      nextMonthDates
    );
  }, [matrix, matrixYear, matrixMonth, type, prevMonthDates, nextMonthDates]);

  const moveWeek = (delta: number) => {
    const date = new Date(Date.UTC(year, month - 1, day + delta * 7));
    setCurrentDate(toISODateString(date));
  };

  return {
    currentDate,
    setCurrentDate,
    weekDates,
    monthlyWeekGrid,
    moveToNext: () => moveWeek(1),
    moveToPrev: () => moveWeek(-1),
    moveToPeriod: moveWeek,
  };
};

export default WeekCalendar;
