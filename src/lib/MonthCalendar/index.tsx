import { useState } from "react";

import { CALENDAR_LENGTH, DEFAULT_TRASH_VALUE } from "../utils/constants";
import createCalendar from "../utils/createCalendar";
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
      // Convert initialDate to UTC and set to first day of month
      return toISODateString(
        new Date(
          Date.UTC(initialDate.getUTCFullYear(), initialDate.getUTCMonth(), 1)
        )
      );
    }

    // Get current UTC date without creating a local Date first
    const now = new Date();
    const utcMs = now.getTime() - now.getTimezoneOffset() * 60000;
    const utcNow = new Date(utcMs);
    return toISODateString(
      new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), 1))
    );
  });

  const [year, month] = currentDate.split("-").map(Number);

  const monthCalendarData = createCalendar({
    type,
    year,
    month: month - 1,
    calendarLength: CALENDAR_LENGTH,
    createPrevDays: (prevDaysCount) => {
      return Array.from({ length: prevDaysCount }).map(
        () => DEFAULT_TRASH_VALUE
      );
    },
    createNextDays: (nextDaysCount) => {
      return Array.from({ length: nextDaysCount }).map(
        () => DEFAULT_TRASH_VALUE
      );
    },
  });

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
