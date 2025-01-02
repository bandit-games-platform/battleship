import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.ts";
import * as PIXI from "pixi.js";
import {ExplosionSprite} from "../components/effects/ExplosionSprite.tsx";
import {useGetLobbyState} from "../hooks/useGetLobbyState.ts";
import {LoadingIcon} from "../components/globalComponents/LoadingIcon.tsx";
import {Point} from "pixi.js";

interface LobbyQueueProps {
    setScene: (scene: string) => void
    lobbyId?: string
    playerId: string
}

export function LobbyQueue({setScene, lobbyId, playerId}: LobbyQueueProps) {
    const {app, canvasSize} = useContext(AppContext);
    const {lobby, isLoading: lobbyLoading, isError: lobbyError} = useGetLobbyState(lobbyId);

    useEffect(() => {
        console.log(lobby)
    }, [lobby])

    useEffect(() => {
        if (app && app.stage) {
            const background = new PIXI.Graphics();
            background.beginFill(0x1099bb);
            background.drawRect(0, 0, app.view.width, app.view.height);
            background.endFill();
            app.stage.addChild(background);

            if (lobbyLoading) {
                const onTick = [
                    LoadingIcon(app, new Point((app.view.width / 2) - 50, (app.view.height / 2) - 50)),
                ];

                const tickerCallback = (delta: number) => {
                    onTick.forEach((cb) => cb(delta));
                };
                app.ticker.add(tickerCallback);

                return () => {
                    app.ticker.remove(tickerCallback);
                };
            }

            if (lobbyError) {
                const errorText = new PIXI.Text('Could not load lobby! Try again later.', {fill: '#ff0000'})
                errorText.anchor.set(0.5);
                errorText.x = app.view.width / 2;
                errorText.y = app.view.height / 2;
                app.stage.addChild(errorText);

                return () => {
                    app.stage.removeChild(errorText);
                    errorText.destroy(true);
                };
            }

            const lobbyText = new PIXI.Text('Lobby Scene is me', { fontSize: 24, fill: '#ffff00' });
            lobbyText.anchor.set(0.5);
            lobbyText.x = app.view.width / 2;
            lobbyText.y = app.view.height / 2;
            app.stage.addChild(lobbyText);

            const lobbyInfoText = new PIXI.Text('Lobby id ' + lobbyId + ' player ' + playerId);
            lobbyInfoText.anchor.set(0.5);
            lobbyInfoText.x = app.view.width / 2;
            lobbyInfoText.y = (app.view.height / 3) * 2;
            app.stage.addChild(lobbyInfoText);

            // Clean up on unmount
            return () => {
                app.stage.removeChild(background);
                app.stage.removeChild(lobbyText);
                app.stage.removeChild(lobbyInfoText);
                background.destroy(true);
                lobbyText.destroy(true);
            };
        }
    }, [app, canvasSize, lobbyError, lobbyId, lobbyLoading, playerId, setScene]);

    return (
        <ExplosionSprite x={canvasSize.width/2} y={canvasSize.height/2-100} />
    );
}
