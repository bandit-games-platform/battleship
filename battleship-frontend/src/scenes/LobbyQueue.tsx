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

    useEffect(() => {
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

            const playerCards: PIXI.Graphics[] = [];
            const numberPlayers = currentLobby.players.length;
            for (let i = 0; i < numberPlayers; i++) {
                const player = currentLobby.players[i];
                const card = new PIXI.Graphics();
                card.beginFill(0x1434A4);
                card.drawRoundedRect(0, 0, 200, 300, 20);
                card.endFill();

                if (numberPlayers === 1) {
                    card.x = (app.view.width / 2) - 100
                } else {
                    card.x = ((app.view.width / 5) * (2 + i)) - 100
                }
                card.y = (app.view.height / 5) * 2 - 150;

                const readyText = new PIXI.Text(player.ready ? 'Ready' : 'Not Ready', { fontSize: 24, fill: '#ffffff' });
                readyText.anchor.set(0.5);
                readyText.x = card.width / 2;
                readyText.y = 25;
                card.addChild(readyText);

                let playerNumberText = "Player " + (i + 1);
                if (player.playerId === playerId) playerNumberText += " (you)"

                const playerText = new PIXI.Text(playerNumberText, { fontSize: 20, fill: '#ffffff' });
                playerText.anchor.set(0.5);
                playerText.x = card.width / 2;
                playerText.y = card.height - 25;
                card.addChild(playerText);

                const playerImage = PIXI.Sprite.from('../assets/captain.png');
                playerImage.anchor.set(0.5);
                playerImage.width = 150;
                playerImage.height = 150;
                playerImage.x = card.width / 2;
                playerImage.y = card.height / 2;
                card.addChild(playerImage);

                playerCards.push(card);
            }
            for (const card of playerCards) {
                app.stage.addChild(card);
            }

            // Clean up on unmount
            return () => {
                app.stage.removeChild(background);
                app.stage.removeChild(button);

                for (const card of playerCards) {
                    app.stage.removeChild(card);
                    card.destroy(true);
                }

                background.destroy(true);
                button.destroy(true);
            };
        }
    }, [app, canvasSize, currentLobby, lobbyError, lobbyId, lobbyLoading, playerId, readyError, readyPending, readyToggle, setScene, updatedLobby]);

    return null;
}
