import {useContext, useEffect} from "react";
import {ThemeContext} from "../context/ThemeContext.ts";
import {AppContext} from "../context/AppContext.ts";
import * as PIXI from "pixi.js";
import {ITextStyle} from "pixi.js";

interface SettingsMenuProps {
    x: number,
    y: number,
    width: number,
    height: number
}

const margin = 10;
const setting_labels_style: Partial<ITextStyle> = {fontSize: 24, fill: '#333', fontWeight: "bold"};
const inner_settings_style: Partial<ITextStyle> = {fontSize: 20, fill: '#000'};


export function SettingsMenu({x, y, width, height}: SettingsMenuProps) {
    const {app} = useContext(AppContext);
    const {theme, nextTheme, prevTheme} = useContext(ThemeContext);

    useEffect(() => {
        if (app && app.stage) {
            const background = new PIXI.Graphics();
            background.beginFill(0xffffff, 0.2);
            background.drawRoundedRect(0, 0, width, height, 20);
            background.endFill();
            background.x = x;
            background.y = y;
            app.stage.addChild(background);

            // THEME SELECT
            const theme_setting_label = new PIXI.Text("Visual Theme", setting_labels_style);
            theme_setting_label.x = margin;
            theme_setting_label.y = margin;

            const current_theme_name = new PIXI.Text(theme.meta.name, inner_settings_style);
            current_theme_name.anchor.set(0.5, 0);
            current_theme_name.y = margin + theme_setting_label.height;

            const arrow_size = current_theme_name.height;
            const prev_theme_arrow = new PIXI.Graphics();
            prev_theme_arrow.beginFill(0x000000);
            prev_theme_arrow.drawPolygon([
                arrow_size, current_theme_name.y,
                0, current_theme_name.y + arrow_size/2,
                arrow_size, current_theme_name.y + arrow_size,
            ]);
            prev_theme_arrow.endFill();
            prev_theme_arrow.x = margin;
            prev_theme_arrow.eventMode = 'static';
            prev_theme_arrow.cursor = 'pointer';
            prev_theme_arrow.on('pointerdown', () => prevTheme())

            current_theme_name.x = prev_theme_arrow.x + prev_theme_arrow.width + 100;

            const next_theme_arrow = new PIXI.Graphics();
            next_theme_arrow.beginFill(0x000000);
            next_theme_arrow.drawPolygon([
                0, current_theme_name.y,
                arrow_size, current_theme_name.y + arrow_size/2,
                0, current_theme_name.y + arrow_size,
            ]);
            next_theme_arrow.endFill();
            next_theme_arrow.x = current_theme_name.x + 100;
            next_theme_arrow.eventMode = 'static';
            next_theme_arrow.cursor = 'pointer';
            next_theme_arrow.on('pointerdown', () => nextTheme())

            background.addChild(theme_setting_label, prev_theme_arrow, current_theme_name, next_theme_arrow);


            return () => {
                app.stage.removeChild(background);
                background.destroy(true);
            }
        }
    }, [app, height, nextTheme, prevTheme, theme.meta.name, width, x, y]);

    return null;
}
