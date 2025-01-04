import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.ts";
import {ThemeContext} from "../context/ThemeContext.ts";
import {splitAnimationFrames} from "../utils/textureSplitter.ts";
import {AnimatedSprite, Graphics} from "pixi.js";

interface BoardProps {
    pos: {
        x: number
        y: number
    }
    size: number
}

export const BOARD_CELLS = 10;

export function Board({pos, size}: BoardProps) {
    const {app} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);

    const [bg, setBg] = useState<AnimatedSprite>();

    useEffect(() => {
        splitAnimationFrames(theme.board_background_anim).then(res => {
            const animatedBackground = new AnimatedSprite(res.frames);
            animatedBackground.animationSpeed = theme.board_background_anim.speed ?? 0.1;
            animatedBackground.loop = true;
            animatedBackground.play();
            setBg(animatedBackground);
        });

    }, [theme.board_background_anim]);

    useEffect(() => {
        if (app && app.stage && bg) {
            bg.x = pos.x;
            bg.y = pos.y;
            bg.width = size;
            bg.height = size;
            app.stage.addChild(bg);

            const grid = new Graphics();
            grid.lineStyle(theme.board_grid.line_width, theme.board_grid.line_color, theme.board_grid.line_alpha);
            const gridSize = size / bg.scale.x / BOARD_CELLS;

            for (let x = 0; x <= BOARD_CELLS; x++) {
                grid.moveTo(x * gridSize, 0);
                grid.lineTo(x * gridSize, bg.height / bg.scale.y);
            }
            for (let y = 0; y <= BOARD_CELLS; y++) {
                grid.moveTo(0, y * gridSize);
                grid.lineTo(bg.width / bg.scale.x, y * gridSize);
            }

            bg.addChild(grid);

            return () => {
                bg.removeChild(grid);
                app.stage.removeChild(bg);
                grid.destroy(true);
            }
        }
    }, [app, bg, pos, size, theme.board_grid]);

    return null;
}
