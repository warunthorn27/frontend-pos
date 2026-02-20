import React, { useState, useMemo, useRef, useEffect } from "react";
import DatePickerIcon from "../../assets/svg/date-picker.svg?react";
import PreviousIcon from "../../assets/svg/previous.svg?react";
import NextIcon from "../../assets/svg/next.svg?react";

interface Props {
  label: string;
  value?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
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

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const DatePicker: React.FC<Props> = ({ label, value, onChange }) => {
  const today = new Date();

  const initialDate = value ? new Date(value) : today;

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null,
  );

  const [viewDate, setViewDate] = useState(initialDate);
  const [mode, setMode] = useState<ViewMode>("day");
  const [open, setOpen] = useState(false);
  const [headerFocus, setHeaderFocus] = useState<"month" | "year" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const calendarDays = useMemo(() => {
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
  }, [year, month]);

  function selectDate(date: Date) {
    setSelectedDate(date);
    onChange?.(formatDate(date));
    setHeaderFocus(null);
    setMode("day");
    setOpen(false);
  }

  function changeMonth(offset: number) {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + offset);
    setViewDate(d);
  }

  function changeYear(offset: number) {
    const d = new Date(viewDate);
    d.setFullYear(d.getFullYear() + offset);
    setViewDate(d);
  }

  const displayValue = selectedDate ? formatDate(selectedDate) : "";

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setHeaderFocus(null);
        setMode("day");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full relative">
      <label className="block text-base mb-2">{label}</label>

      {/* Input */}
      <div
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;

            if (next && selectedDate) {
              setViewDate(selectedDate);
            }

            return next;
          });
        }}
        className="w-full h-[38px] border border-[#E6E6E6] bg-white rounded-md px-3 flex items-center justify-between cursor-pointer"
      >
        <span
          className={`text-sm ${displayValue ? "text-black" : "text-gray-400"}`}
        >
          {displayValue || "YYYY-MM-DD"}
        </span>

        <DatePickerIcon className="w-5 h-5" />
      </div>

      {/* Popup */}
      {open && (
        <div className="absolute mt-1 w-[280px] bg-white border rounded-md shadow-lg p-4 z-50">
          {/* Header */}
          <div className="flex items-center justify-between border rounded-lg px-3 py-2 mb-3">
            <button
              onClick={() =>
                headerFocus === "year" ? changeYear(-12) : changeMonth(-1)
              }
              className="w-8 h-8 flex items-center justify-center rounded-md transition hover:bg-gray-100 active:scale-95"
            >
              <PreviousIcon className="w-6 h-6 text-[#545454]" />
            </button>

            <div className="flex gap-2 text-sm text-gray-800 font-medium">
              {/* MONTH */}
              <button
                onClick={() => {
                  setMode("month");
                  setHeaderFocus("month");
                }}
                className={`px-3 py-1 rounded-md transition hover:bg-gray-100 text-base font-normal
                  ${
                    headerFocus === "month"
                      ? "border bg-gray-50"
                      : "border border-transparent"
                  }
                  `}
              >
                {months[month]}
              </button>

              {/* YEAR */}
              <button
                onClick={() => {
                  setMode("year");
                  setHeaderFocus("year");
                }}
                className={`px-3 py-1 rounded-md transition hover:bg-gray-100 text-base font-normal
                  ${
                    headerFocus === "year"
                      ? " border bg-gray-50"
                      : "border border-transparent"
                  }
                  `}
              >
                {year}
              </button>
            </div>

            <button
              onClick={() =>
                headerFocus === "year" ? changeYear(12) : changeMonth(1)
              }
              className="w-8 h-8 flex items-center justify-center rounded-md transition hover:bg-gray-100 active:scale-95"
            >
              <NextIcon className="w-6 h-6 text-[#545454]" />
            </button>
          </div>

          <div className="relative">
            {/* DAY VIEW */}
            {mode === "day" && (
              <>
                <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
                  {daysOfWeek.map((d) => (
                    <div key={d} className="text-center">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1 text-sm font-light">
                  {calendarDays.map(({ date, currentMonth }) => {
                    const isToday = isSameDay(date, today);
                    const isSelected =
                      selectedDate && isSameDay(date, selectedDate);

                    return (
                      <button
                        key={date.getTime()}
                        onClick={() => selectDate(date)}
                        className={`
                        h-8 w-8 mx-auto rounded-full
                        ${currentMonth ? "" : "text-gray-300"}
                        ${isToday ? "text-[#0690F1] font-medium" : ""}
                        ${isSelected ? "bg-[#0690F1] text-white" : ""}
                      `}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* MONTH VIEW */}
            {mode === "month" && (
              <div className="grid grid-cols-2 gap-y-1 text-sm">
                {months.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => {
                      const d = new Date(viewDate);
                      d.setMonth(i);
                      setViewDate(d);
                      setHeaderFocus(null);
                      setMode("day");
                    }}
                    className={`
                    py-2 rounded-md text-gray-800
                    ${i === month ? "bg-gray-50 font-medium text-gray-800" : ""}
                  `}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {/* YEAR VIEW */}
            {mode === "year" && (
              <div className="grid grid-cols-2 gap-y-1 text-sm">
                {Array.from({ length: 12 }).map((_, i) => {
                  const y = year - 5 + i;

                  return (
                    <button
                      key={y}
                      onClick={() => {
                        const d = new Date(viewDate);
                        d.setFullYear(y);
                        setViewDate(d);
                        setHeaderFocus(null);
                        setMode("day");
                      }}
                      className={`
                      py-2 rounded-md text-gray-800
                      ${y === year ? "bg-gray-50 font-medium text-gray-800" : ""}
                    `}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
