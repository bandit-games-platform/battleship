import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.ts";
import * as PIXI from "pixi.js";

interface NewShotDisplayProps {
    shot: {col: number, row: number, miss: boolean}
    onDisplayComplete: () => void
}

export function NewShotDisplay({shot, onDisplayComplete}: NewShotDisplayProps) {
    const {app, canvasSize} = useContext(AppContext);

    useEffect(() => {
        if (app && app.stage) {
            const shotAtBox = new PIXI.Graphics();
            shotAtBox.zIndex = 30
            shotAtBox.beginFill(0x000000, 1);
            shotAtBox.drawRect(0, 0, 400, 200);
            shotAtBox.endFill();
            shotAtBox.x = canvasSize.width / 2 - 400 / 2;
            shotAtBox.y = canvasSize.height / 2 - 200 / 2;

            const columnLetter = String.fromCharCode(65 + shot.col);
            let displayText = "Captain! We've been shot at in " + columnLetter + (shot.row + 1) + "!\n"
            displayText += shot.miss ? "Luckily they missed!" : "Unfortunately they hit us"

            const confirmText = new PIXI.Text(displayText, { fontSize: 24, fill: '#ffffff', align: "center" });
            confirmText.anchor.set(0.5)
            confirmText.x = shotAtBox.width / 2;
            confirmText.y = shotAtBox.height / 3;
            shotAtBox.addChild(confirmText);

            app.stage.addChild(shotAtBox);

            const understoodButton = new PIXI.Graphics();
            understoodButton.beginFill(0x097969);
            understoodButton.drawRect(0, 0, 200, 50);
            understoodButton.endFill();
            understoodButton.x = shotAtBox.width / 2 - 100;
            understoodButton.y = (shotAtBox.height / 3) * 2;
            understoodButton.eventMode = 'static';
            understoodButton.on('pointerdown', () => {
                onDisplayComplete()
                app.stage.removeChild(shotAtBox);
                shotAtBox.destroy(true);
            });

            const buttonText = new PIXI.Text('Understood!', { fontSize: 24, fill: '#ffffff' });
            buttonText.anchor.set(0.5);
            buttonText.x = understoodButton.width / 2;
            buttonText.y = understoodButton.height / 2;
            understoodButton.addChild(buttonText);
            shotAtBox.addChild(understoodButton);

            return () => {
                app.stage.removeChild(shotAtBox);
            }
        }
    }, [app, canvasSize.height, canvasSize.width, onDisplayComplete, shot.col, shot.miss, shot.row])

    return null;
}