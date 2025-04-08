import { formatDate } from "./formatDate";

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
  type: string,
  includeAdjacentMonths: boolean = false
): CalendarMatrix => {
  // month는 0-based (0: 1월, 11: 12월)
  const firstDayDate = new Date(Date.UTC(year, month, 1));
  const firstDay = firstDayDate.getUTCDay();
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
  let nextMonthDate = 1;

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
          prevMonthDates[prevDate] = formatDate(fullDate, type);
        }
      } else if (date <= lastDate) {
        // 현재 달의 날짜
        matrix[week][day] = date++;
      } else {
        // 다음 달의 날짜
        matrix[week][day] = includeAdjacentMonths ? -nextMonthDate : 0;
        if (includeAdjacentMonths) {
          const fullDate = new Date(
            Date.UTC(nextYear, adjustedNextMonth, nextMonthDate)
          );
          nextMonthDates[nextMonthDate] = formatDate(fullDate, type);
        }
        nextMonthDate++;
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
  let targetWeek = matrix.find((week) => week.includes(targetDate));

  if (!targetWeek && targetDate > 28) {
    targetWeek = matrix[matrix.length - 1];
  }

  if (!targetWeek) return [];

  return targetWeek.map((day) => {
    if (day > 0) {
      // 현재 달의 날짜
      return formatDate(new Date(Date.UTC(year, month, day)), type);
    } else if (day < 0) {
      // 이전/다음 달의 날짜
      const absDay = Math.abs(day);
      const dateString = prevMonthDates[absDay] || nextMonthDates[absDay];
      if (!dateString) return "0";

      return formatDate(new Date(dateString), type);
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
        return formatDate(new Date(Date.UTC(year, month, day)), type);
      } else if (includeAdjacentMonths && day < 0) {
        // 이전/다음 달의 날짜
        const absDay = Math.abs(day);
        const dateString = prevMonthDates[absDay] || nextMonthDates[absDay];
        if (!dateString) return "0";

        return formatDate(new Date(dateString), type);
      }
      return "0";
    })
  );
};
