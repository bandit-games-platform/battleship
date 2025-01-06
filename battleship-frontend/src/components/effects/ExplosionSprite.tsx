
import {useContext, useEffect} from "react";
import {AppContext} from "../../context/AppContext.ts";
import {ThemeContext} from "../../context/ThemeContext.ts";
import {textureAnimator} from "../../utils/textureAnimator.ts";

interface ExplosionSpriteProps {
    x: number,
    y: number,
    show: boolean,
    toggleShow: () => void
}

export function ExplosionSprite({x,y, show, toggleShow}: ExplosionSpriteProps) {
    const {app, canvasSize} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        if (app && app.stage) {
            if (!show) return;

            textureAnimator(theme.effects.explosion_anim, app, x, y).then(toggleShow);
        }
    }, [app, canvasSize, show, theme.effects.explosion_anim, toggleShow, x, y]);

    return null;
}
