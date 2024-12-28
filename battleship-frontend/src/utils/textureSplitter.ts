import {Assets, Rectangle, Texture} from "pixi.js";

export async function splitAnimationFramesFromImage(imagePath: string, cols: number, rows: number, unusedFrames: number = 0) {
    const texture = await Assets.load(imagePath);
    const frameWidth = texture.width / cols;
    const frameHeight = texture.height / rows;

    const frames = [];
    for (let i = 0; i < (cols*rows - unusedFrames); i++) {
        const x = (i % cols) * frameWidth;
        const y = Math.floor(i / cols) * frameHeight;
        const frame = new Texture(texture, new Rectangle(x, y, frameWidth, frameHeight));
        frames.push(frame);
    }

    return {frames, frameWidth, frameHeight};
}
