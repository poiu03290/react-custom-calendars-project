import { format } from "date-fns-tz";

interface CalendarMatrix {
  matrix: number[][];
  year: number;
  month: number;
  prevMonthDates: { [key: number]: string };
  nextMonthDates: { [key: number]: string };
}

export const createCalendarMatrix = (
  year: number,
  month: number,
  includeAdjacentMonths: boolean = false
): CalendarMatrix => {
  // month는 0-based (0: 1월, 11: 12월)
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const lastDate = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  // 이전 달의 마지막 날짜 계산
  const prevMonth = month - 1;
  const prevYear = prevMonth < 0 ? year - 1 : year;
  const adjustedPrevMonth = prevMonth < 0 ? 11 : prevMonth;
  const lastDayOfPrevMonth = new Date(
    Date.UTC(prevYear, adjustedPrevMonth + 1, 0)
  ).getUTCDate();

  // 다음 달 계산
  const nextMonth = month + 1;
  const nextYear = nextMonth > 11 ? year + 1 : year;
  const adjustedNextMonth = nextMonth > 11 ? 0 : nextMonth;

  // 6주 x 7일의 고정된 달력 배열 생성
  const matrix: number[][] = Array(6)
    .fill(null)
    .map(() => Array(7).fill(0));

  const prevMonthDates: { [key: number]: string } = {};
  const nextMonthDates: { [key: number]: string } = {};

  // 날짜 채우기
  let date = 1;
  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      if (week === 0 && day < firstDay) {
        // 이전 달의 날짜
        const prevDate = lastDayOfPrevMonth - (firstDay - day - 1);
        matrix[week][day] = includeAdjacentMonths ? -prevDate : 0;
        if (includeAdjacentMonths) {
          const fullDate = new Date(
            Date.UTC(prevYear, adjustedPrevMonth, prevDate)
          );
          prevMonthDates[prevDate] = format(fullDate, "yyyy-MM-dd", {
            timeZone: "UTC",
          });
        }
      } else if (date > lastDate) {
        // 다음 달의 날짜
        const nextDate = date - lastDate;
        matrix[week][day] = includeAdjacentMonths ? -nextDate : 0;
        if (includeAdjacentMonths) {
          const fullDate = new Date(
            Date.UTC(nextYear, adjustedNextMonth, nextDate)
          );
          nextMonthDates[nextDate] = format(fullDate, "yyyy-MM-dd", {
            timeZone: "UTC",
          });
        }
        date++;
      } else {
        matrix[week][day] = date++;
      }
    }
  }

  return { matrix, year, month, prevMonthDates, nextMonthDates };
};

export const getWeekFromMatrix = (
  matrix: number[][],
  year: number,
  month: number,
  targetDate: number,
  prevMonthDates: { [key: number]: string },
  nextMonthDates: { [key: number]: string },
  type: string
): string[] => {
  // targetDate가 있는 주 찾기
  const targetWeek = matrix.find((week) => week.includes(targetDate));
  if (!targetWeek) return [];

  return targetWeek.map((day) => {
    if (day > 0) {
      // 현재 달의 날짜
      const date = new Date(Date.UTC(year, month, day));
      return format(date, type, { timeZone: "UTC" });
    } else if (day < 0) {
      // 이전/다음 달의 날짜
      const absDay = Math.abs(day);
      const dateString = prevMonthDates[absDay] || nextMonthDates[absDay];
      if (!dateString) return "0";
      return format(new Date(dateString), type, { timeZone: "UTC" });
    }
    return "0";
  });
};

export const formatMatrixDates = (
  matrix: number[][],
  year: number,
  month: number,
  type: string,
  includeAdjacentMonths: boolean = false,
  prevMonthDates: { [key: number]: string } = {},
  nextMonthDates: { [key: number]: string } = {}
): string[][] => {
  return matrix.map((week) =>
    week.map((day) => {
      if (day > 0) {
        // 현재 달의 날짜
        const date = new Date(Date.UTC(year, month, day));
        return format(date, type, { timeZone: "UTC" });
      } else if (includeAdjacentMonths && day < 0) {
        // 이전/다음 달의 날짜
        const absDay = Math.abs(day);
        const dateString = prevMonthDates[absDay] || nextMonthDates[absDay];
        if (!dateString) return "0";
        return format(new Date(dateString), type, { timeZone: "UTC" });
      }
      return "0";
    })
  );
};
