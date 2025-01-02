import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.ts";
import * as PIXI from "pixi.js";
import {useGetLobbyState} from "../hooks/useGetLobbyState.ts";
import {LoadingIcon} from "../components/globalComponents/LoadingIcon.tsx";
import {Point} from "pixi.js";
import {Player} from "../model/Player.ts";
import {Lobby} from "../model/Lobby.ts";
import {useReadyToggle} from "../hooks/useReadyToggle.ts";

interface LobbyQueueProps {
    setScene: (scene: string) => void
    lobbyId?: string
    playerId: string
}

export function LobbyQueue({setScene, lobbyId, playerId}: LobbyQueueProps) {
    const {app, canvasSize} = useContext(AppContext);
    const {lobby, isLoading: lobbyLoading, isError: lobbyError} = useGetLobbyState(lobbyId);
    const {readyToggle, isPending: readyPending, isError: readyError, lobby: updatedLobby} = useReadyToggle();
    const [currentLobby, setCurrentLobby] = useState<Lobby | undefined>()

    useEffect(() => {
        console.log(lobby)
        if (lobby) {
            setCurrentLobby(lobby)

            let allReady = true;
            for (const player of lobby.players) {
                if (!player.ready) allReady = false;
            }

            if (allReady) {
                setScene("arrange_ships");
            }
        }
    }, [lobby, setScene])

    const toggleReadiness = () => {
        console.log("Toggling ready state for player")
        if (lobbyId && playerId) {
            readyToggle({lobbyId, playerId});

            while (readyPending) {
                setTimeout(() => {console.log("Waiting for ready confirmation")}, 10);
            }
            if (!readyError) {
                setCurrentLobby(updatedLobby);
            }
        }
    }

    useEffect(() => {
        if (app && app.stage) {
            const background = new PIXI.Graphics();
            background.beginFill(0x1099bb);
            background.drawRect(0, 0, app.view.width, app.view.height);
            background.endFill();
            app.stage.addChild(background);

            if (lobbyLoading || !currentLobby) {
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

            const player: Player | undefined = currentLobby.players.find(p => p.playerId === playerId)
            if (!player) {
                const noPlayerText = new PIXI.Text('Joining lobby...', {fill: '#4F7942'})
                noPlayerText.anchor.set(0.5);
                noPlayerText.x = app.view.width / 2;
                noPlayerText.y = app.view.height / 2;
                app.stage.addChild(noPlayerText);

                return () => {
                    app.stage.removeChild(noPlayerText);
                    noPlayerText.destroy(true);
                };
            }

            const button = new PIXI.Graphics();
            button.beginFill(0x000000);
            button.drawRect(0, 0, 200, 50);
            button.endFill();
            button.x = app.view.width / 2 - 100;
            button.y = (app.view.height / 3) * 2;
            button.eventMode = 'static';
            button.on('pointerdown', toggleReadiness);

            const buttonText = new PIXI.Text(player.ready ? 'Unready' : 'Ready Up', { fontSize: 24, fill: '#ffffff' });
            buttonText.anchor.set(0.5);
            buttonText.x = button.width / 2;
            buttonText.y = button.height / 2;
            button.addChild(buttonText);

            app.stage.addChild(button);

            const lobbyInfoText = new PIXI.Text('Lobby id ' + lobbyId + ' player ' + playerId);
            lobbyInfoText.anchor.set(0.5);
            lobbyInfoText.x = app.view.width / 2;
            lobbyInfoText.y = app.view.height / 3;
            app.stage.addChild(lobbyInfoText);

            // Clean up on unmount
            return () => {
                app.stage.removeChild(background);
                app.stage.removeChild(lobbyInfoText);
                app.stage.removeChild(button);
                background.destroy(true);
                button.destroy(true);
            };
        }
    }, [app, canvasSize, currentLobby, lobbyError, lobbyId, lobbyLoading, playerId, setScene]);

    return (
        <div></div>
    );
}
