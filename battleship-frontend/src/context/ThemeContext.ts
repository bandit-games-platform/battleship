import {BattleshipTheme} from "../themes/BattleshipTheme.ts";
import {createContext} from "react";
import {themes} from "../themes/themes.ts";

export interface IThemeContext {
    theme: BattleshipTheme,
    themeIndex: number,
    prevTheme: () => void,
    nextTheme: () => void,
    setTheme: (index: number) => void
}

export const ThemeContext = createContext<IThemeContext>({
    theme: themes[0],
    themeIndex: 0,
    prevTheme: () => {},
    nextTheme: () => {},
    setTheme: () => {}
});
