import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.ts";
import * as PIXI from "pixi.js";
import {useGetLobbyState} from "../hooks/useGetLobbyState.ts";
import {Player} from "../model/Player.ts";
import {Lobby} from "../model/Lobby.ts";
import {useReadyToggle} from "../hooks/useReadyToggle.ts";
import {IdentityContext} from "../context/IdentityContext.ts";
import {GeneralStatusCheck} from "../utils/generalStatusCheck.ts";
import {ThemeContext} from "../context/ThemeContext.ts";

interface LobbyQueueProps {
    setScene: (scene: string) => void
}

export function LobbyQueue({setScene}: LobbyQueueProps) {
    const {lobbyId, playerId} = useContext(IdentityContext);
    const {app, canvasSize} = useContext(AppContext);
    const {setTheme} = useContext(ThemeContext);
    const {lobby, isLoading: lobbyLoading, isError: lobbyError} = useGetLobbyState(lobbyId);
    const {readyToggle, isPending: readyPending, isError: readyError, lobby: updatedLobby} = useReadyToggle();
    const [currentLobby, setCurrentLobby] = useState<Lobby | undefined>()

    useEffect(() => {
        console.log(lobby)
        if (lobby) {
            setCurrentLobby(lobby);
            setTheme(lobby.themeIndex);

            if (lobby.stage === "arranging") {
                setScene("arrange_ships");
            }
        }
    }, [lobby, setScene, setTheme])

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
            background.beginFill(0x5F9EA0);
            background.drawRect(0, 0, app.view.width, app.view.height);
            background.endFill();
            app.stage.addChild(background);

            if (lobbyLoading || !currentLobby || lobbyError) {
                return GeneralStatusCheck({object: currentLobby!, objectLoading: lobbyLoading, objectError: lobbyError, objectString: "lobby", app})
            }

            const player: Player | undefined = currentLobby.players.find(p => p.playerId === playerId)
            if (!player) {
                const noPlayerText = new PIXI.Text('Joining lobby...', {fill: '#4F7942'})
                noPlayerText.anchor.set(0.5);
                noPlayerText.x = canvasSize.width / 2;
                noPlayerText.y = canvasSize.height / 2;
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
            button.x = canvasSize.width / 2 - 100;
            button.y = (canvasSize.height / 3) * 2;
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
                card.drawRoundedRect(0, 0, canvasSize.width / 6, canvasSize.height / 2, 20);
                card.endFill();

                if (numberPlayers === 1) {
                    card.x = (canvasSize.width / 2) - card.width / 2
                } else {
                    card.x = ((canvasSize.width / 5) * (2 + i)) - card.width / 2
                }
                card.y = (canvasSize.height / 3) - card.height / 2;

                const readyText = new PIXI.Text(player.ready ? 'Ready' : 'Not Ready', { fontSize: card.width * 0.15 / card.scale.x, fill: '#ffffff' });
                readyText.anchor.set(0.5);
                readyText.x = card.width / 2;
                readyText.y = 25;
                card.addChild(readyText);

                let playerNumberText = "Player " + (i + 1);
                if (player.playerId === playerId) playerNumberText += " (you)"

                const playerText = new PIXI.Text(playerNumberText, { fontSize: card.width * 0.15 / card.scale.x, fill: '#ffffff' });
                playerText.anchor.set(0.5);
                playerText.x = card.width / 2;
                playerText.y = card.height - 25;
                card.addChild(playerText);

                const playerImage = PIXI.Sprite.from('../assets/captain.png');
                playerImage.anchor.set(0.5);
                playerImage.width = card.width * 0.8 / card.scale.x;
                playerImage.height = card.width * 0.8 / card.scale.x;
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
