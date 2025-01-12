import {LoadingIcon} from "../components/globalComponents/LoadingIcon.tsx";
import {Point} from "pixi.js";
import * as PIXI from "pixi.js";
import {Lobby} from "../model/Lobby.ts";

interface GeneralStatusCheckProps {
    object: Lobby
    objectLoading: boolean
    objectError: boolean
    objectString: string
    app: PIXI.Application
}

export function GeneralStatusCheck ({object, objectLoading, objectError, objectString, app}: GeneralStatusCheckProps) {
    if (objectLoading || !object) {
        const { update, container } = LoadingIcon(
            app,
            new Point(app.view.width / 2 - 50, app.view.height / 2 - 50)
        );

        const tickerCallback = (delta: number) => {
            update(delta);
        };

        app.ticker.add(tickerCallback);

        return () => {
            app.ticker.remove(tickerCallback);
            container.destroy()
        };
    }

    if (objectError) {
        const errorText = new PIXI.Text(`Could not load ${objectString}! Try again later.`, {fill: '#ff0000'})
        errorText.anchor.set(0.5);
        errorText.x = app.view.width / 2;
        errorText.y = app.view.height / 2;
        app.stage.addChild(errorText);

        return () => {
            app.stage.removeChild(errorText);
            errorText.destroy(true);
        };
    }
}