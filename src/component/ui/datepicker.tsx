import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface CustomDatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
}) => {
  // 🛠️ Config
  const height = "32px"; 
  const bgColor = "#ffffff"; 

  return (
    <div className="w-full">
      <label className="block text-sm mb-1.5 font-normal ">
        {label}
      </label>

      <DatePicker
        format="MM/DD/YYYY"
        value={value ? dayjs(value) : null}
        onChange={(newValue) => {
          const formattedDate = newValue ? newValue.format("YYYY-MM-DD") : "";
          onChange(formattedDate);
        }}
        slotProps={{
          // 1. ส่วน Input Field (โค้ดแก้สีที่คุณชอบ)
          textField: {
            size: "small",
            fullWidth: true,
            placeholder: placeholder,
            hiddenLabel: true,
            sx: {
              // Level 1
              backgroundColor: bgColor, 
              
              "& .MuiInputBase-root": {
                height: `${height} !important`,
                minHeight: `${height} !important`,
                
                // Level 2
                backgroundColor: `${bgColor} !important`,
                background: `${bgColor} !important`,
                
                fontSize: "13px",
                paddingRight: "0px",
                borderRadius: "0.375rem",
                "& fieldset": { borderColor: "#E0E0E0" },
                "&.Mui-focused fieldset": { borderColor: "#2F80ED !important" },
              },

              "& .MuiInputBase-input": {
                height: `${height} !important`,
                padding: "0 10px !important",
                display: "flex", alignItems: "center",
                
                // Level 3
                backgroundColor: `${bgColor} !important`,
                background: `${bgColor} !important`,
                
                color: "#333333",
                
                "&:-webkit-autofill": {
                  WebkitBoxShadow: `0 0 0 100px ${bgColor} inset !important`,
                  WebkitTextFillColor: "#333333",
                },
              },

              "& .MuiInputAdornment-root": { marginRight: "0px" },
              "& .MuiSvgIcon-root": { fontSize: "1.1rem", color: "#6B7280" }
            },
          },

          // ✅ 2. ส่วน Popup ปฏิทิน (เพิ่มกลับเข้ามาให้แล้วครับ!)
          popper: {
            sx: {
              "& .MuiDateCalendar-root": {
                width: "260px !important",  // ลดความกว้าง
                height: "auto !important",
                maxHeight: "300px !important",
              },
              "& .MuiPickersDay-root": {
                width: "30px !important",   // ลดขนาดวงกลมวันที่
                height: "30px !important",
                fontSize: "0.75rem !important", 
              },
              "& .MuiDayCalendar-weekDayLabel": {
                width: "30px !important",
                fontSize: "0.75rem !important",
              },
              "& .MuiPickersCalendarHeader-root": {
                paddingLeft: "12px",
                paddingRight: "12px",
                marginBottom: "0px",
              },
              "& .MuiPickersCalendarHeader-label": {
                fontSize: "0.9rem !important",
              }
            }
          },
        }}
      />
    </div>
  );
};

export default CustomDatePicker;