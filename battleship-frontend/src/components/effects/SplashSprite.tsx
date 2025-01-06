
import {useContext, useEffect} from "react";
import {AppContext} from "../../context/AppContext.ts";
import {ThemeContext} from "../../context/ThemeContext.ts";
import {textureAnimator} from "../../utils/textureAnimator.ts";

interface SplashSpriteProps {
    x: number,
    y: number,
    show: boolean,
    toggleShow: () => void
}

export function SplashSprite({x,y, show, toggleShow}: SplashSpriteProps) {
    const {app, canvasSize} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        if (app && app.stage) {
            console.log(show)
            if (!show) return;

            textureAnimator(theme.effects.splash_anim, app, x, y).then(toggleShow);
        }
    }, [app, canvasSize, show, theme.effects.splash_anim, toggleShow, x, y]);

    return null;
}
