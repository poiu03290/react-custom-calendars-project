import "./App.css";
import { WeekCalendar } from "./lib";
import { MonthCalendar } from "./lib";

function App() {
  const { weekDates, monthlyWeekGrid, currentDate } = WeekCalendar({
    type: "MM/dd",
  });
  const { monthCalendarData } = MonthCalendar({
    type: "MM/dd",
  });

  return (
    <>
      <div>
        <p>currentDate: {currentDate}</p>
        <p>updateDate: 2025-04-08 14:43</p>
        <div>
          <p>weekDates</p>
          <ul>
            {weekDates.map((date) => (
              <li>{date}</li>
            ))}
          </ul>
        </div>

        <div>
          <p>monthlyWeekGrid</p>
          <ul>
            {monthlyWeekGrid.map((weeks, weekIndex) => (
              <li
                key={weekIndex}
                style={{
                  listStyle: "none",
                  display: "flex",
                  gap: "10px",
                }}
              >
                {weeks.map((date, dateIndex) => (
                  <p key={dateIndex} style={{ width: "60px" }}>
                    {date}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p>monthCalendarData</p>
          <ul>
            {monthCalendarData.map((weeks, weekIndex) => (
              <li
                key={weekIndex}
                style={{
                  listStyle: "none",
                  display: "flex",
                  gap: "10px",
                }}
              >
                {weeks.map((date, dateIndex) => (
                  <p key={dateIndex} style={{ width: "60px" }}>
                    {date}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
