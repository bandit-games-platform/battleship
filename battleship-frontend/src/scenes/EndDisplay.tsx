import {useContext, useEffect, useState} from "react";
import {IdentityContext} from "../context/IdentityContext.ts";
import {AppContext} from "../context/AppContext.ts";
import {useResetToggle} from "../hooks/useResetToggle.ts";
import * as PIXI from "pixi.js";
import {useGetLobbyState} from "../hooks/useGetLobbyState.ts";
import {useEndStats} from "../hooks/useEndStats.ts";
import {ThemeContext} from "../context/ThemeContext.ts";

interface EndDisplayProps {
    setScene: (scene: string) => void
}

export function EndDisplay({setScene}: EndDisplayProps) {
    const {lobbyId, playerId} = useContext(IdentityContext);
    const {app, canvasSize} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);
    const [ready, setReady] = useState(false);
    const [soundPlayed, setSoundPlayed] = useState(false);
    const {isError: error, readyToggle} = useResetToggle();
    const {lobby} = useGetLobbyState(lobbyId);
    const {stats} = useEndStats(lobbyId? lobbyId: "");

    useEffect(() => {
        if (lobby) {
            if (lobby.stage === "queueing") {
                setScene("lobby_queue");
            }
        }
    }, [lobby, setScene])

    useEffect(() => {
        const toggleReadiness = async () => {
            console.log("Toggling ready state for player")
            if (lobbyId && playerId) {
                const status = await readyToggle({lobbyId, playerId});

                if (!error && status === 200) {
                    setReady(!ready);
                    console.log("Ready to play again? " + ready)
                }
            }
        }

        const playSound = async (soundUrl: string) => {
            const sound = new Audio(soundUrl);
            sound.volume = 0.8;
            await sound.play()
            sound.remove()
        }

        if (app && app.stage) {
            const background = new PIXI.Graphics();
            background.beginFill(0x5F9EA0);
            background.drawRect(0, 0, app.view.width, app.view.height);
            background.endFill();
            app.stage.addChild(background);

            const button = new PIXI.Graphics();
            button.beginFill(0x000000);
            button.drawRect(0, 0, 400, 100);
            button.endFill();
            button.x = app.view.width / 2 - 200;
            button.y = (app.view.height / 3) * 2;
            button.eventMode = 'static';
            button.on('pointerdown', toggleReadiness);

            const buttonText = new PIXI.Text(ready ? 'Nevermind' : 'Play Again', { fontSize: 30, fill: '#ffffff' });
            buttonText.anchor.set(0.5);
            buttonText.x = button.width / 2;
            buttonText.y = button.height / 2;
            button.addChild(buttonText);

            app.stage.addChild(button);

            let resultText = new PIXI.Text();
            let resultSign = new PIXI.Text();
            if (stats) {
                if (stats.winningPlayer === playerId) {
                    if (!soundPlayed) {
                        playSound(theme.sounds.victory_sound);
                        setSoundPlayed(true);
                    }

                    resultText = new PIXI.Text('Congratulations Captain! The Victory is Ours!', {
                        fontSize: 30,
                        fill: '#ffffff'
                    });

                    resultSign = new PIXI.Text('VICTORY!', {
                        fontSize: 100,
                        fill: '#228B22',
                        fontFamily: "Impact"
                    });
                } else {
                    if (!soundPlayed) {
                        playSound(theme.sounds.defeat_sound);
                        setSoundPlayed(true);
                    }

                    resultText = new PIXI.Text("I'm sorry Captain, but unfortunately we were defeated!", {
                        fontSize: 30,
                        fill: '#ffffff'
                    });

                    resultSign = new PIXI.Text('DEFEAT!', {
                        fontSize: 100,
                        fill: '#C41E3A',
                        fontFamily: "Impact"
                    });
                }
            }

            resultText.anchor.set(0.5);
            resultText.x = app.view.width / 2;
            resultText.y = app.view.height / 2;

            resultSign.anchor.set(0.5);
            resultSign.x = app.view.width / 2;
            resultSign.y = app.view.height / 3;

            app.stage.addChild(resultText);
            app.stage.addChild(resultSign);

            return () => {
                app.stage.removeChild(background);
                app.stage.removeChild(button);
                app.stage.removeChild(resultText);
                app.stage.removeChild(resultSign);

                background.destroy(true);
                button.destroy(true);
                resultText.destroy(true);
                resultSign.destroy(true);
            };
        }
    }, [app, canvasSize, error, lobbyId, playerId, ready, readyToggle, setScene, stats, theme.sounds.defeat_sound, theme.sounds.victory_sound]);

    return null;
}