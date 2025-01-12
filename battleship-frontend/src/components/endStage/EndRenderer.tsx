import {EndStats} from "../../model/EndStats.ts";
import {useContext, useEffect, useState} from "react";
import {IdentityContext} from "../../context/IdentityContext.ts";
import {AppContext} from "../../context/AppContext.ts";
import {ThemeContext} from "../../context/ThemeContext.ts";
import {useResetToggle} from "../../hooks/useResetToggle.ts";
import * as PIXI from "pixi.js";

interface EndRendererProps {
    stats: EndStats
    setSoundPlayed: (played: boolean) => void
    soundPlayed: boolean
    setSpaceBetween: (space: number) => void
    setBottomOfText: (bottom: number) => void
}

export function EndRenderer({stats, soundPlayed, setSoundPlayed, setSpaceBetween, setBottomOfText}: EndRendererProps) {
    const {lobbyId, playerId} = useContext(IdentityContext);
    const {app, canvasSize} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);
    const [ready, setReady] = useState(false);
    const {isError: error, readyToggle} = useResetToggle();

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
            background.drawRect(0, 0, 200, 100);
            background.endFill();
            app.stage.addChild(background);

            const button = new PIXI.Graphics();
            button.beginFill(0x000000);
            button.drawRect(0, 0, canvasSize.width * 0.2, canvasSize.height * 0.1);
            button.endFill();
            button.x = canvasSize.width / 2 - button.width / 2;
            button.y = canvasSize.height - button.height - 10;
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
                        fontSize: 25,
                        fill: '#ffffff'
                    });

                    resultSign = new PIXI.Text('VICTORY!', {
                        fontSize: 80,
                        fill: '#228B22',
                        fontFamily: "Impact"
                    });
                } else {
                    if (!soundPlayed) {
                        playSound(theme.sounds.defeat_sound);
                        setSoundPlayed(true);
                    }

                    resultText = new PIXI.Text("I'm sorry Captain, but unfortunately we were defeated!", {
                        fontSize: 25,
                        fill: '#ffffff'
                    });

                    resultSign = new PIXI.Text('DEFEAT!', {
                        fontSize: 80,
                        fill: '#C41E3A',
                        fontFamily: "Impact"
                    });
                }
            }

            resultText.anchor.set(0.5);
            resultText.x = app.view.width / 2;
            resultText.y = 10 + resultSign.height + resultText.height/2;

            resultSign.anchor.set(0.5);
            resultSign.x = app.view.width / 2;
            resultSign.y = 10 + resultSign.height/2;

            app.stage.addChild(resultText);
            app.stage.addChild(resultSign);

            setSpaceBetween(button.y - (resultText.y + resultText.height));
            setBottomOfText(resultText.y + resultText.height);

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
    }, [app, canvasSize, error, lobbyId, playerId, ready, readyToggle, setBottomOfText, setSoundPlayed, setSpaceBetween, soundPlayed, stats, theme.sounds]);

    return null;
}