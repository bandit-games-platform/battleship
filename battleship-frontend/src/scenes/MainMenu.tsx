import {useContext, useEffect, useState} from 'react';
import * as PIXI from 'pixi.js';
import {AppContext} from "../context/AppContext.ts";
import {useCreateLobby} from "../hooks/useCreateLobby.ts";
import {IdentityContext} from "../context/IdentityContext.ts";
import {SettingsMenu} from "../components/SettingsMenu.tsx";

interface MainMenuProps {
    setScene: (scene: string) => void
    setLobbyId: (lobbyId: string) => void
}

export function MainMenu({ setScene, setLobbyId }: MainMenuProps) {
    const {app, canvasSize} = useContext(AppContext);
    const {playerId} = useContext(IdentityContext);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

    const {createLobby, isPending: creatingLobby, isError: failedToCreateLobby} = useCreateLobby();

    useEffect(() => {
        if (app && app.stage) {
            const background = new PIXI.Graphics();
            background.beginFill(0xff7e5f);
            background.drawRect(0, 0, canvasSize.width, canvasSize.height);
            background.endFill();
            app.stage.addChild(background);

            return () => {
                app.stage.removeChild(background);
                background.destroy(true);
            }
        }
    }, [app, canvasSize]);

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

        const handleSettings = () => {
            setSettingsOpen(!settingsOpen);
        }
        
        if (app && app.stage) {
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

            // Create a start game button on the canvas
            const buttonSettings = new PIXI.Graphics();
            buttonSettings.beginFill(settingsOpen?0x333333:0x000000);
            buttonSettings.drawRect(0, 0, 200, 50);
            buttonSettings.endFill();
            buttonSettings.x = 100 + (settingsOpen?10:0);
            buttonSettings.y = canvasSize.height/2 + 50;
            buttonSettings.eventMode = 'static';
            buttonSettings.on('pointerdown', handleSettings);
            const buttonSettingsText = new PIXI.Text("Settings", { fontSize: 24, fill: '#ffffff' });
            buttonSettingsText.anchor.set(0.5);
            buttonSettingsText.x = buttonSettings.width / 2;
            buttonSettingsText.y = buttonSettings.height / 2;
            buttonSettings.addChild(buttonSettingsText);

            app.stage.addChild(button, buttonSettings);

            // Clean up on unmount
            return () => {
                app.stage.removeChild(button, buttonSettings);
                button.destroy(true);
                buttonSettings.destroy(true);
            };
        }
    }, [app, canvasSize, createLobby, creatingLobby, failedToCreateLobby, playerId, setLobbyId, setScene, settingsOpen]);

    return (
        <>
            {settingsOpen && <SettingsMenu x={400} y={canvasSize.height/2} width={canvasSize.width-500} height={canvasSize.height/2 * 0.8} />}
        </>
    );
}
