import {BattleshipTheme} from "../themes/BattleshipTheme.ts";
import {createContext} from "react";
import {themes} from "../themes/themes.ts";

export interface IThemeContext {
    theme: BattleshipTheme,
    prevTheme: () => void,
    nextTheme: () => void
}

export const ThemeContext = createContext<IThemeContext>({
    theme: themes[0],
    prevTheme: () => {},
    nextTheme: () => {}
});
