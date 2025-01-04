import {ReactNode, useState} from "react";
import {ThemeContext} from "./ThemeContext.ts";
import {themes} from "../themes/themes.ts";

interface ThemeProviderProps {
    children: ReactNode
}

export function ThemeProvider({children}: ThemeProviderProps) {
    const [themeIndex, setThemeIndex] = useState<number>(0);

    const prevTheme = () => {
        if (themeIndex - 1 >= 0) {
            setThemeIndex(themeIndex - 1);
            return;
        }
        setThemeIndex(themes.length - 1);
    }
    const nextTheme = () => {
        if (themeIndex + 1 < themes.length) {
            setThemeIndex(themeIndex + 1);
            return;
        }
        setThemeIndex(0);
    }

    return (
        <ThemeContext.Provider value={{
            theme: themes[themeIndex],
            prevTheme,
            nextTheme
        }}>
            {children}
        </ThemeContext.Provider>
    )
}
