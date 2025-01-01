import { useContext, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import {AppContext} from "../context/AppContext.ts";
import {useCreateLobby} from "../hooks/useCreateLobby.ts";
import {IdentityContext} from "../context/IdentityContext.ts";

interface MainMenuProps {
    setScene: (scene: string) => void
    setLobbyId: (lobbyId: string) => void
}

export function MainMenu({ setScene, setLobbyId }: MainMenuProps) {
    const {app, canvasSize} = useContext(AppContext);
    const {playerId} = useContext(IdentityContext);
    const {createLobby, isPending: creatingLobby, isError: failedToCreateLobby} = useCreateLobby();

    useEffect(() => {
        const handleStartGame = () => {
            if (creatingLobby) return;
            
            createLobby(playerId, {
                onSuccess: (newLobby) => {
                    setLobbyId(newLobby.lobbyId);
                    setScene('lobby_queue');
                }
            });
        }
        
        if (app && app.stage) {
            const background = new PIXI.Graphics();
            background.beginFill(0xff7e5f);
            background.drawRect(0, 0, app.view.width, app.view.height);
            background.endFill();
            app.stage.addChild(background);

            // Create a start game button on the canvas
            const button = new PIXI.Graphics();
            button.beginFill(failedToCreateLobby?0x440000:0x000000);
            button.drawRect(0, 0, 200, 50);
            button.endFill();
            button.x = 100 + (creatingLobby?10:0);
            button.y = app.view.height / 2 - 25;
            button.eventMode = 'static';
            button.on('pointerdown', handleStartGame);
            const buttonText = new PIXI.Text(creatingLobby?'Starting...':'Start Game', { fontSize: 24, fill: '#ffffff' });
            buttonText.anchor.set(0.5);
            buttonText.x = button.width / 2;
            buttonText.y = button.height / 2;
            button.addChild(buttonText);

            app.stage.addChild(button);

            // Clean up on unmount
            return () => {
                app.stage.removeChild(background);
                app.stage.removeChild(button);
                background.destroy(true);
                button.destroy(true);
            };
        }
    }, [app, canvasSize, createLobby, creatingLobby, failedToCreateLobby, playerId, setLobbyId, setScene]);

    return null;
}
