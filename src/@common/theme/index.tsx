import { createContext, ReactNode, useContext, useMemo } from "react";

import { ThemeColors } from "./types";
import { defaultTheme } from "./default-theme";

interface Context {
  colors: ThemeColors;
}

const ThemeContext = createContext<Context>({
  colors: defaultTheme,
});

export const ThemeProvider = ({
  children,
  defaultColors,
}: {
  children: ReactNode;
  defaultColors: ThemeColors;
}) => {
  const themeContext: Context = useMemo(
    () => ({
      colors: defaultColors,
    }),
    []
  );

  return (
    <ThemeContext.Provider value={{ ...themeContext }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
