
import {useContext, useEffect} from "react";
import {AppContext} from "../../context/AppContext.ts";
import {AnimatedSprite} from "pixi.js";
import {splitAnimationFrames} from "../../utils/textureSplitter.ts";
import {ThemeContext} from "../../context/ThemeContext.ts";

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

            const animate = async () => {
                const {frames, frameWidth, frameHeight} = await splitAnimationFrames(theme.effects.explosion_anim);
                const animatedSprite = new AnimatedSprite(frames);
                animatedSprite.zIndex = 20
                animatedSprite.loop = false;
                animatedSprite.animationSpeed = theme.effects.explosion_anim.speed ?? 0.25;
                animatedSprite.x = x - frameWidth / 2;
                animatedSprite.y = y - frameHeight / 2;
                animatedSprite.play();
                app.stage.addChild(animatedSprite);

                animatedSprite.onComplete = () => {
                    app.stage.removeChild(animatedSprite);
                }
            }

            animate().then(toggleShow)
        }
    }, [app, canvasSize, show, theme.effects.explosion_anim, toggleShow, x, y]);

    return null;
}
