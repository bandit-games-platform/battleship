import {createContext} from "react";
import * as PIXI from "pixi.js";

export interface IAppContext {
    app: PIXI.Application | null,
    canvasSize: {width: number, height: number}
}

export const AppContext = createContext<IAppContext>({
    app: null,
    canvasSize: {width: window.innerWidth, height: window.innerHeight}
});
