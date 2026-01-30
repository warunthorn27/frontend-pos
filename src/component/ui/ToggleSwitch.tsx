import * as React from "react";
import Switch, { switchClasses } from "@mui/joy/Switch";
import type { Theme } from "@mui/joy/styles";

export type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
}) => {
  return (
    <Switch
      size={size}
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      sx={(theme: Theme) => ({
        "--Switch-thumbShadow": "0 3px 7px 0 rgba(0 0 0 / 0.12)",
        "--Switch-thumbSize": "18px",
        "--Switch-trackWidth": "40px",
        "--Switch-trackHeight": "22px",
        "--Switch-trackBackground": theme.vars.palette.background.level3,

        [`& .${switchClasses.thumb}`]: {
          transition: "width 0.2s, left 0.2s",
        },

        "&:hover": {
          "--Switch-trackBackground": theme.vars.palette.background.level3,
        },

        "&:active": {
          "--Switch-thumbWidth": "20px",
        },

        // active, edit

        [`&.${switchClasses.checked}`]: {
          "--Switch-trackBackground": "rgb(48 209 88)",
          "&:hover": {
            "--Switch-trackBackground": "rgb(48 209 88)",
          },
        },

        // disabled switch color
        [`&.${switchClasses.disabled}`]: {
          "--Switch-trackBackground": "#D1D5DB",
          opacity: 1,
          cursor: "not-allowed",

          [`& .${switchClasses.thumb}`]: {
            backgroundColor: "#FFFFFF",
          },
        },
      })}
    />
  );
};

export default ToggleSwitch;
