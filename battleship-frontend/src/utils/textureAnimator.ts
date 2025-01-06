import {splitAnimationFrames} from "./textureSplitter.ts";
import {AnimatedSprite} from "pixi.js";
import {AnimSpriteSheet} from "../themes/BattleshipTheme.ts";
import * as PIXI from "pixi.js";

export async function textureAnimator(theme_anim: AnimSpriteSheet, app: PIXI.Application, x: number, y:number) {
    const {frames, frameWidth, frameHeight} = await splitAnimationFrames(theme_anim);
    const animatedSprite = new AnimatedSprite(frames);
    animatedSprite.zIndex = 20
    animatedSprite.loop = false;
    animatedSprite.animationSpeed = theme_anim.speed ?? 0.25;
    animatedSprite.x = x - frameWidth / 2;
    animatedSprite.y = y - frameHeight / 2;
    animatedSprite.play();
    app.stage.addChild(animatedSprite);

    animatedSprite.onComplete = () => {
        app.stage.removeChild(animatedSprite);
    }
}