import {useContext, useEffect} from "react";
import {AppContext} from "../../context/AppContext.ts";
import * as PIXI from "pixi.js";

interface BoardTextRendererProps {
    boardSize: number
    playerBoardX: number
    opponentBoardX: number
    boardY: number
}

export function BoardTextRenderer({boardSize, playerBoardX, opponentBoardX, boardY}: BoardTextRendererProps) {
    const {app, canvasSize} = useContext(AppContext);

    useEffect(() => {
        if (app && app.stage) {
            const yourBoardText = new PIXI.Text("Your Ships", {fontSize: canvasSize.width * 0.025, fill: '#191970', fontFamily: "Impact"});
            yourBoardText.anchor.set(0.5);
            yourBoardText.x = playerBoardX + boardSize / 2;
            yourBoardText.y = boardY + boardSize + yourBoardText.height / 2 + 5;
            app.stage.addChild(yourBoardText);

            const opponentBoardText = new PIXI.Text("Opponent's Ships", {
                fontSize: canvasSize.width * 0.025,
                fill: '#191970',
                fontFamily: "Impact"
            });
            opponentBoardText.anchor.set(0.5);
            opponentBoardText.x = opponentBoardX + boardSize / 2;
            opponentBoardText.y = boardY + boardSize + opponentBoardText.height / 2 + 5;
            app.stage.addChild(opponentBoardText);

            return () => {
                app.stage.removeChild(yourBoardText);
                app.stage.removeChild(opponentBoardText);

                yourBoardText.destroy(true);
                opponentBoardText.destroy(true);
            }
        }
    }, [app, boardSize, boardY, canvasSize.height, canvasSize.width, opponentBoardX, playerBoardX]);

    return null;
}