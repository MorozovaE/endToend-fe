import { MenuItem, Select } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export const LangToggle = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language);

  interface Locales {
    [language: string]: {
      title: string;
    };
  }

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
