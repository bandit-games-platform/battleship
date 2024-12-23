import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.ts";
import * as PIXI from "pixi.js";

interface LobbyQueueProps {
    setScene: (scene: string) => void
}

export function LobbyQueue({setScene}: LobbyQueueProps) {
    const {app, canvasSize} = useContext(AppContext);

    useEffect(() => {
        if (app && app.stage) {
            const background = new PIXI.Graphics();
            background.beginFill(0x0000ff);
            background.drawRect(0, 0, app.view.width, app.view.height);
            background.endFill();
            app.stage.addChild(background);

            const lobbyText = new PIXI.Text('Lobby Scene is me', { fontSize: 24, fill: '#ffff00' });
            lobbyText.anchor.set(0.5);
            lobbyText.x = app.view.width / 2;
            lobbyText.y = app.view.height / 2;
            app.stage.addChild(lobbyText);

            // Clean up on unmount
            return () => {
                app.stage.removeChild(background);
                app.stage.removeChild(lobbyText);
                background.destroy(true);
                lobbyText.destroy(true);
            };
        }
    }, [app, canvasSize, setScene]);

    return null;
}
