
import {useContext, useEffect} from "react";
import {AppContext} from "../../context/AppContext.ts";
import {AnimatedSprite} from "pixi.js";
import {splitAnimationFramesFromImage} from "../../utils/textureSplitter.ts";

interface ExplosionSpriteProps {
    x: number,
    y: number
}

export function ExplosionSprite({x,y}: ExplosionSpriteProps) {
    const {app, canvasSize} = useContext(AppContext);

    useEffect(() => {
        if (app && app.stage) {
            const animate = async () => {
                const {frames, frameWidth, frameHeight} = await splitAnimationFramesFromImage('../assets/explosion.png', 5, 2)
                const animatedSprite = new AnimatedSprite(frames);
                animatedSprite.loop = false;
                animatedSprite.animationSpeed = 0.25;
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
    }, [app, canvasSize, x, y]);

    return null;
}
