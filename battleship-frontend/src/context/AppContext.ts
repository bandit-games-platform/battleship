// Define the type for AppContext
import {Context, createContext} from "react";
import * as PIXI from "pixi.js";

export const AppContext: Context<PIXI.Application | null> = createContext<PIXI.Application | null>(null);
