import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.ts";
import * as PIXI from "pixi.js";
import {FederatedPointerEvent} from "pixi.js";
import {Lobby} from "../model/Lobby.ts";
import {IdentityContext} from "../context/IdentityContext.ts";
import {useShootShot} from "../hooks/useShootShot.ts";
import {ShotDto} from "../model/ShotDto.ts";
import {IdentityDto} from "../model/IdentityDto.ts";
import {useQueryClient} from "@tanstack/react-query";

interface ClickableBattleAreaProps {
    pos: {
        x: number
        y: number
    }
    size: number
    squareSize: number
    lobby: Lobby
    hitDisplay: (col: number, row: number) => void
    missDisplay: (col: number, row: number) => void
}

export function ClickableBattleArea({pos, size, squareSize, lobby, hitDisplay, missDisplay}: ClickableBattleAreaProps) {
    const {app, canvasSize} = useContext(AppContext);
    const {playerId} = useContext(IdentityContext);
    const queryClient = useQueryClient()
    const {shootShot, isPending: shotPending} = useShootShot();

    useEffect(() => {
        const submitShot = async (col: number, row: number) => {
            console.log("Shooting at col " + col + " row " + row);

            const identity: IdentityDto = {lobbyId: lobby.lobbyId, playerId};
            const dto: ShotDto = {identity, column: col, row};
            const result = await shootShot(dto);

            await queryClient.invalidateQueries({queryKey: ['lobby', lobby.lobbyId], refetchType: "all"})

            if (result) {
                if (result.status === 200 && (result.shotResult.shotResult === "HIT" || result.shotResult.shotResult === "SUNK")) {
                    hitDisplay(col, row);
                } else if (result.status === 200 && (result.shotResult.shotResult === "MISS")) {
                    missDisplay(col, row);
                }
            }
        }

        if (app && app.stage) {
            let confirmationBox = new PIXI.Graphics();

            const clickableArea = new PIXI.Graphics();
            // Make an interactable square the size of the board
            clickableArea.hitArea = new PIXI.Rectangle(pos.x, pos.y, size, size);

            const clickBoard = (event: FederatedPointerEvent) => {
                if (lobby.turnOf != playerId || shotPending) {
                    return;
                }

                const clickedPos = event.getLocalPosition(clickableArea);
                const boardRelPos = {
                    x: clickedPos.x - pos.x,
                    y: clickedPos.y - pos.y
                }

                // quick bounds check
                if (boardRelPos.x < 0 || boardRelPos.x > size) return null;
                if (boardRelPos.y < 0 || boardRelPos.y > size) return null;

                // calculate the shot coordinate
                const col = Math.floor(boardRelPos.x / squareSize);
                const row = Math.floor(boardRelPos.y / squareSize);

                confirmationBox = new PIXI.Graphics();
                confirmationBox.zIndex = 25
                confirmationBox.beginFill(0x000000, 1);
                confirmationBox.drawRect(0, 0, 400, 200);
                confirmationBox.endFill();
                confirmationBox.x = canvasSize.width / 2 - 400 / 2;
                confirmationBox.y = canvasSize.height / 2 - 200 / 2;

                const columnLetter = String.fromCharCode(65 + col);
                const confirmText = new PIXI.Text("Do you want to shoot at: " + columnLetter + (row + 1) + "?", { fontSize: 24, fill: '#ffffff' });
                confirmText.anchor.set(0.5)
                confirmText.x = confirmationBox.width / 2;
                confirmText.y = confirmationBox.height / 3;
                confirmationBox.addChild(confirmText);

                const button = new PIXI.Graphics();
                button.beginFill(0x097969);
                button.drawRect(0, 0, 100, 50);
                button.endFill();
                button.x = (confirmationBox.width / 3) * 2 - 50;
                button.y = (confirmationBox.height / 3) * 2;
                button.eventMode = 'static';
                button.on('pointerdown', () => {
                    submitShot(col, row);
                    app.stage.removeChild(confirmationBox);
                    confirmationBox.destroy(true);
                });

                const buttonText = new PIXI.Text('Shoot!', { fontSize: 24, fill: '#ffffff' });
                buttonText.anchor.set(0.5);
                buttonText.x = button.width / 2;
                buttonText.y = button.height / 2;
                button.addChild(buttonText);
                confirmationBox.addChild(button);

                const buttonCancel = new PIXI.Graphics();
                buttonCancel.beginFill(0xC41E3A);
                buttonCancel.drawRect(0, 0, 100, 50);
                buttonCancel.endFill();
                buttonCancel.x = confirmationBox.width / 3 - 50;
                buttonCancel.y = (confirmationBox.height / 3) * 2;
                buttonCancel.eventMode = 'static';
                buttonCancel.on('pointerdown', () => {
                    app.stage.removeChild(confirmationBox);
                    confirmationBox.destroy(true);
                });

                const buttonCancelText = new PIXI.Text('ABORT!', { fontSize: 24, fill: '#ffffff' });
                buttonCancelText.anchor.set(0.5);
                buttonCancelText.x = button.width / 2;
                buttonCancelText.y = button.height / 2;
                buttonCancel.addChild(buttonCancelText);
                confirmationBox.addChild(buttonCancel);

                app.stage.addChild(confirmationBox);

                console.log("Clicked col: " + col + " row: " + row)
            }

            clickableArea.eventMode = 'static';
            clickableArea.cursor = 'pointer';

            clickableArea.on('pointerdown', clickBoard);

            app.stage.addChild(clickableArea);

            return () => {
                clickableArea.off('pointerdown', clickBoard);
                app.stage.removeChild(clickableArea);
                app.stage.removeChild(confirmationBox);
                clickableArea.destroy(true);
            }
        }
    }, [app, pos, size, squareSize, canvasSize, lobby.turnOf, playerId, lobby.lobbyId, shootShot]);

    return null;
}
