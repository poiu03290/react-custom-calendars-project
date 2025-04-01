import { useState } from "react";
import { format } from "date-fns-tz";

import { WEEK_CALENDAR_LENGTH, DAY_OF_WEEK } from "../utils/constants";
import { toISODateString } from "../utils/date";
import createCalendar from "../utils/createCalendar";

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
    const utcMs = now.getTime() - now.getTimezoneOffset() * 60000;
    return toISODateString(new Date(utcMs));
  });

  const [year, month, day] = currentDate.split("-").map(Number);

  const getUTCWeekStart = (date: Date): Date => {
    const dayOfWeek = date.getUTCDay();

    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() - dayOfWeek
      )
    );
  };

  const weekDates = Array.from({ length: DAY_OF_WEEK }).map((_, index) => {
    const currentUTCDate = new Date(Date.UTC(year, month - 1, day));
    const weekStart = getUTCWeekStart(currentUTCDate);
    const currentDay = new Date(
      Date.UTC(
        weekStart.getUTCFullYear(),
        weekStart.getUTCMonth(),
        weekStart.getUTCDate() + index
      )
    );

    return format(currentDay, type, { timeZone: "UTC" });
  });

  const monthlyWeekGrid = createCalendar({
    type,
    year,
    month: month - 1,
    calendarLength: WEEK_CALENDAR_LENGTH,
    createPrevDays: (prevDaysCount, year, month) => {
      const prevMonth = month - 1;
      const prevYear = prevMonth < 0 ? year - 1 : year;
      const adjustedPrevMonth = prevMonth < 0 ? 11 : prevMonth;
      const lastDayOfPrevMonth = new Date(
        Date.UTC(prevYear, adjustedPrevMonth + 1, 0)
      ).getUTCDate();

      return Array.from({ length: prevDaysCount }).map((_, i) => {
        const date = new Date(
          Date.UTC(
            prevYear,
            adjustedPrevMonth,
            lastDayOfPrevMonth - prevDaysCount + i + 1
          )
        );
        return format(date, type, { timeZone: "UTC" });
      });
    },
    createNextDays: (nextDaysCount, year, month) => {
      const nextMonth = month + 1;
      const nextYear = nextMonth > 11 ? year + 1 : year;
      const adjustedNextMonth = nextMonth > 11 ? 0 : nextMonth;

      return Array.from({ length: nextDaysCount }).map((_, i) => {
        const date = new Date(Date.UTC(nextYear, adjustedNextMonth, i + 1));
        return format(date, type, { timeZone: "UTC" });
      });
    },
  });

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
