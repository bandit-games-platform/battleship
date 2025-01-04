
import {useContext, useEffect} from "react";
import {AppContext} from "../../context/AppContext.ts";
import {AnimatedSprite} from "pixi.js";
import {splitAnimationFrames} from "../../utils/textureSplitter.ts";
import {ThemeContext} from "../../context/ThemeContext.ts";

interface ExplosionSpriteProps {
    x: number,
    y: number
}

export function ExplosionSprite({x,y}: ExplosionSpriteProps) {
    const {app, canvasSize} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        if (app && app.stage) {
            const animate = async () => {
                const {frames, frameWidth, frameHeight} = await splitAnimationFrames(theme.effects.explosion_anim);
                const animatedSprite = new AnimatedSprite(frames);
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

            animate()
        }
    }, [app, canvasSize, theme.effects.explosion_anim, x, y]);

    return null;
}
