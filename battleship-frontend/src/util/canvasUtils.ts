import * as PIXI from 'pixi.js';
import {CSSProperties} from "react";

const resizeCanvas = (app: PIXI.Application, width: number, height: number) => {
    const ratio = Math.min(window.innerWidth / width, window.innerHeight / height);

    if (app.renderer.view && app.renderer.view.style) {
        const viewStyle = app.renderer.view.style as CSSProperties;
        viewStyle.width = `${width * ratio}px`;
        viewStyle.height = `${height * ratio}px`;

        viewStyle.marginTop = `${(window.innerHeight - height * ratio) / 2}px`;
        viewStyle.marginLeft = `${(window.innerWidth - width * ratio) / 2}px`;
    }

    app.renderer.resize(window.innerWidth, window.innerHeight);
};

export { resizeCanvas };
