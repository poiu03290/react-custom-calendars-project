import { format } from "date-fns-tz";
import { DAY_OF_WEEK } from "./constants";

interface CalendarOptions {
  type: string;
  year: number;
  month: number;
  calendarLength: number;
  createPrevDays: (
    prevDaysCount: number,
    year: number,
    month: number
  ) => string[];
  createNextDays: (
    nextDaysCount: number,
    year: number,
    month: number
  ) => string[];
}

export default function createCalendar({
  type,
  year,
  month,
  calendarLength,
  createPrevDays,
  createNextDays,
}: CalendarOptions) {
  const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
  const totalMonthDays = lastDayOfMonth.getUTCDate();

  const prevDaysCount = firstDayOfMonth.getUTCDay();
  const nextDaysCount = calendarLength - totalMonthDays - prevDaysCount;

  const currentDayList = Array.from({ length: totalMonthDays }).map((_, i) => {
    const currentDate = new Date(Date.UTC(year, month, i + 1));
    return format(currentDate, type, { timeZone: "UTC" });
  });

  const prevDayList = createPrevDays(prevDaysCount, year, month);
  const nextDayList = createNextDays(nextDaysCount, year, month);

  const calendarList = [...prevDayList, ...currentDayList, ...nextDayList];

  return calendarList.reduce((acc: string[][], cur, idx) => {
    const chunkIndex = Math.floor(idx / DAY_OF_WEEK);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(cur);
    return acc;
  }, []);
}
