import { MenuItem, Select } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

interface Locales {
  [language: string]: {
    title: string;
  };
}
export const LangToggle = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language);

  const locales: Locales = {
    en: {
      title: "English",
    },
    ru: {
      title: "Русский",
    },
  };

  return (
    <Select
      sx={{
        color: "white",
        boxShadow: "none",
        ".MuiOutlinedInput-notchedOutline": { border: 0 },
        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            border: 0,
          },
        ".MuiSvgIcon-root ": {
          fill: "white",
        },
        ".MuiSelect-select": {
          pl: 0,
        },
      }}
      value={lang}
      onChange={(e) => {
        i18n.changeLanguage(e.target.value);
        setLang(e.target.value);
      }}
    >
      {Object.keys(locales).map((locale) => (
        <MenuItem key={locale} value={locale}>
          {locales[locale].title}
        </MenuItem>
      ))}
    </Select>
  );
};
