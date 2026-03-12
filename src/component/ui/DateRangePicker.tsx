import React, { useState, useRef, useEffect } from "react";
import DatePickerIcon from "../../assets/svg/date-picker.svg?react";
import PreviousIcon from "../../assets/svg/previous.svg?react";
import NextIcon from "../../assets/svg/next.svg?react";
import RemoveIcon from "../../assets/svg/remove.svg?react";
import { formatDateDisplay, formatDateInput } from "../../utils/date";

interface Props {
  startDate?: string;
  endDate?: string;
  onChange?: (start: string, end: string) => void;
}

type ViewMode = "day" | "month" | "year";

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(date: Date, start: Date, end: Date) {
  return date > start && date < end;
}

function generateCalendarDays(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const days: { date: Date; currentMonth: boolean }[] = [];

  for (let i = 0; i < startDay; i++) {
    const d = new Date(year, month, -startDay + i + 1);
    days.push({ date: d, currentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: new Date(year, month, i), currentMonth: true });
  }

  while (days.length < 42) {
    const last = days[days.length - 1].date;
    const next = new Date(last);
    next.setDate(last.getDate() + 1);
    days.push({ date: next, currentMonth: false });
  }

  return days;
}

const DateRangePicker: React.FC<Props> = ({ startDate, endDate, onChange }) => {
  const today = new Date();

  const [modeLeft, setModeLeft] = useState<ViewMode>("day");
  const [modeRight, setModeRight] = useState<ViewMode>("day");

  const [focusLeft, setFocusLeft] = useState<"month" | "year" | null>(null);
  const [focusRight, setFocusRight] = useState<"month" | "year" | null>(null);

  const [start, setStart] = useState<Date | null>(
    startDate ? new Date(startDate) : null,
  );

  const [end, setEnd] = useState<Date | null>(
    endDate ? new Date(endDate) : null,
  );

  const [viewDateLeft, setViewDateLeft] = useState(start || today);
  const [viewDateRight, setViewDateRight] = useState(
    new Date(
      (start || today).getFullYear(),
      (start || today).getMonth() + 1,
      1,
    ),
  );
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  function selectDate(date: Date) {
    if (!start || (start && end)) {
      setStart(date);
      setEnd(null);
      return;
    }

    if (start && !end) {
      if (date < start) {
        setStart(date);
        setEnd(start);
        onChange?.(formatDateInput(date), formatDateInput(start));
      } else {
        setEnd(date);
        onChange?.(formatDateInput(start), formatDateInput(date));
      }
    }
  }

  function changeMonth(offset: number, side: "left" | "right") {
    if (side === "left") {
      const d = new Date(viewDateLeft);
      d.setMonth(d.getMonth() + offset);
      setViewDateLeft(d);
    } else {
      const d = new Date(viewDateRight);
      d.setMonth(d.getMonth() + offset);
      setViewDateRight(d);
    }
  }

  function changeYear(offset: number, side: "left" | "right") {
    if (side === "left") {
      const d = new Date(viewDateLeft);
      d.setFullYear(d.getFullYear() + offset);
      setViewDateLeft(d);
    } else {
      const d = new Date(viewDateRight);
      d.setFullYear(d.getFullYear() + offset);
      setViewDateRight(d);
    }
  }

  const displayValue =
    start && end
      ? `${formatDateDisplay(start)} - ${formatDateDisplay(end)}`
      : "";

  function clearDate(e: React.MouseEvent) {
    e.stopPropagation();
    setStart(null);
    setEnd(null);
    onChange?.("", "");
  }

  function resetHeader(side: "left" | "right") {
    if (side === "left") {
      setModeLeft("day");
      setFocusLeft(null);
    } else {
      setModeRight("day");
      setFocusRight(null);
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function renderHeader(baseDate: Date, side: "left" | "right") {
    const focus = side === "left" ? focusLeft : focusRight;
    const setFocus = side === "left" ? setFocusLeft : setFocusRight;
    const setMode = side === "left" ? setModeLeft : setModeRight;

    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    return (
      <div className="flex items-center justify-between border rounded-lg px-3 py-2 mb-3">
        <button
          onClick={() =>
            focus === "year" ? changeYear(-12, side) : changeMonth(-1, side)
          }
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          <PreviousIcon className="w-6 h-6" />
        </button>

        <div className="flex gap-2 text-sm text-gray-800">
          <button
            onClick={() => {
              if (focus === "month") {
                setMode("day");
                setFocus(null);
              } else {
                setMode("month");
                setFocus("month");
              }
            }}
            className={`px-3 py-1 rounded-md transition hover:bg-gray-100 text-base font-normal
            ${focus === "month" ? "border bg-gray-50" : ""}`}
          >
            {months[month]}
          </button>

          <button
            onClick={() => {
              if (focus === "year") {
                setMode("day");
                setFocus(null);
              } else {
                setMode("year");
                setFocus("year");
              }
            }}
            className={`px-3 py-1 rounded-md transition hover:bg-gray-100 text-base font-normal
            ${focus === "year" ? "border bg-gray-50" : ""}`}
          >
            {year}
          </button>
        </div>

        <button
          onClick={() =>
            focus === "year" ? changeYear(12, side) : changeMonth(1, side)
          }
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          <NextIcon className="w-6 h-6" />
        </button>
      </div>
    );
  }

  function renderDays(baseDate: Date) {
    const days = generateCalendarDays(baseDate);

    return (
      <>
        <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
          {daysOfWeek.map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1 text-sm font-light">
          {days.map(({ date, currentMonth }) => {
            const isStart = start && end && isSameDay(date, start);
            const isEnd = start && end && isSameDay(date, end);
            const sameDayRange = start && end && isSameDay(start, end);
            const inRange =
              start && end && !sameDayRange && isBetween(date, start, end);
            const isToday = isSameDay(date, today);

            return (
              <button
                key={date.getTime()}
                onClick={() => selectDate(date)}
                className={`relative h-9 flex items-center justify-center
                  ${currentMonth ? "" : "text-gray-300"}
                `}
              >
                {/* range background */}
                {inRange && <div className="absolute inset-0 bg-[#d6ecff]" />}

                {/* start */}
                {isStart && !sameDayRange && (
                  <div className="absolute inset-0 bg-[#d6ecff] rounded-l-full" />
                )}

                {/* end */}
                {isEnd && !sameDayRange && (
                  <div className="absolute inset-0 bg-[#d6ecff] rounded-r-full" />
                )}

                {/* selected circle */}
                {start && !end && isSameDay(date, start) && (
                  <div className="absolute w-8 h-8 bg-[#0690F1] rounded-full" />
                )}

                {start && end && (isStart || isEnd) && (
                  <div className="absolute w-8 h-8 bg-[#0690F1] rounded-full" />
                )}

                <span
                  className={`
                    relative z-10
                    ${
                      (start && !end && isSameDay(date, start)) ||
                      (start && end && (isStart || isEnd))
                        ? "text-white"
                        : ""
                    }
                    ${isToday ? "text-[#0690F1]" : ""}
                  `}
                >
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderCalendar(baseDate: Date, side: "left" | "right") {
    const mode = side === "left" ? modeLeft : modeRight;

    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    return (
      <div className="w-[250px] text-gray-800">
        {renderHeader(baseDate, side)}

        {mode === "day" && renderDays(baseDate)}

        {mode === "month" && (
          <div className="grid grid-cols-2 gap-y-1 text-sm">
            {months.map((m, i) => (
              <button
                key={m}
                onClick={() => {
                  const d = new Date(baseDate);
                  d.setMonth(i);

                  if (side === "left") {
                    setViewDateLeft(d);
                  } else {
                    setViewDateRight(d);
                  }

                  resetHeader(side);
                }}
                className={`py-2 rounded-md
                ${i === month ? "bg-gray-50 font-medium" : ""}`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {mode === "year" && (
          <div className="grid grid-cols-2 gap-y-1 text-sm">
            {Array.from({ length: 12 }).map((_, i) => {
              const y = year - 5 + i;

              return (
                <button
                  key={y}
                  onClick={() => {
                    const d = new Date(baseDate);
                    d.setFullYear(y);

                    if (side === "left") {
                      setViewDateLeft(d);
                    } else {
                      setViewDateRight(d);
                    }

                    resetHeader(side);
                  }}
                  className={`py-2 rounded-md
                  ${y === year ? "bg-gray-50 font-medium" : ""}`}
                >
                  {y}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-[40px] rounded-md px-3 flex items-center justify-between
        bg-white text-sm transition-colors
        ${open ? "border border-[#005AA7]" : "border border-[#CFCFCF]"}`}
      >
        <span
          className={`text-sm ${displayValue ? "text-black" : "text-gray-400"}`}
        >
          {displayValue || "DD/MM/YYYY - DD/MM/YYYY"}
        </span>

        <div className="flex items-center gap-2">
          {start && end && (
            <span
              onClick={clearDate}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-[#e7e7e7]"
            >
              <RemoveIcon className="w-3.5 h-3.5" />
            </span>
          )}

          <DatePickerIcon className="w-5 h-5" />
        </div>
      </button>

      {open && (
        <div className="absolute mt-1 w-[560px] bg-white border rounded-md shadow-lg p-4 z-50">
          <div className="flex gap-6">
            {renderCalendar(viewDateLeft, "left")}
            {renderCalendar(viewDateRight, "right")}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
