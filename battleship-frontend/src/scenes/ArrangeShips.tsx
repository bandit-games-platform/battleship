import {Board, BOARD_CELLS} from "../components/Board.tsx";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.ts";
import {getShipLength, ShipType} from "../model/ShipType.ts";
import {DraggableShip} from "../components/DraggableShip.tsx";
import * as PIXI from "pixi.js";
import {useSubmitShipArrangement} from "../hooks/useSubmitShipArrangement.ts";
import {IdentityContext} from "../context/IdentityContext.ts";
import {useGetLobbyState} from "../hooks/useGetLobbyState.ts";

const boardMargin = 10;

type ShipPlacements = { [key in ShipType]: {col: number, row: number, isVertical: boolean} | null}


interface ArrangeShipsRendererProps {
    hasSubmitted: boolean,
    buttonDisabled: boolean,
    boardSize: number,
    handleAcceptFormation: () => void
}

const checkAllShipsPlaced = (placements: ShipPlacements): boolean => {
    return Object.values(ShipType).every(st => placements[st] !== null);
}

function ArrangeShipsRenderer({boardSize, handleAcceptFormation, buttonDisabled, hasSubmitted}: ArrangeShipsRendererProps) {
    const {app, canvasSize} = useContext(AppContext);

    useEffect(() => {
        if (app && app.stage) {
            const background = new PIXI.Graphics();
            background.beginFill(0xe5decf);
            background.drawRect(0, 0, canvasSize.width, canvasSize.height);
            background.endFill();
            app.stage.addChild(background);

            if (hasSubmitted) {
                const text = new PIXI.Text('Waiting for your opponent...', {fontSize: 32, fill: '#00aa00'});
                text.anchor.set(0.5);
                text.x = (canvasSize.width - (boardSize + boardMargin)) / 2;
                text.y = canvasSize.height - 50 - boardMargin
                app.stage.addChild(text);

                return () => {
                    app.stage.removeChild(text);
                    app.stage.removeChild(background);
                    text.destroy(true);
                    background.destroy(true);
                }
            }else {

                const button = new PIXI.Graphics();
                button.beginFill(buttonDisabled ? 0x444444 : 0x000000);
                button.drawRect(0, 0, canvasSize.width - (boardSize + boardMargin * 5), 100);
                button.endFill();
                button.x = boardMargin * 2;
                button.y = canvasSize.height - 100 - boardMargin;
                button.eventMode = 'static';
                button.cursor = 'pointer';
                button.on('pointerdown', handleAcceptFormation);

                const buttonText = new PIXI.Text('Accept Formation', {fontSize: 32, fill: '#ffffff'});
                buttonText.anchor.set(0.5);
                buttonText.x = button.width / 2;
                buttonText.y = button.height / 2;
                button.addChild(buttonText);
                app.stage.addChild(button);

                return () => {
                    button.off('pointerdown', handleAcceptFormation);
                    app.stage.removeChild(button);
                    app.stage.removeChild(background);
                    button.destroy(true);
                    background.destroy(true);
                }
            }
        }
    }, [app, boardSize, buttonDisabled, canvasSize, handleAcceptFormation, hasSubmitted]);

    return null;
}

interface ArrangeShipsProps {
    setScene: (scene: string) => void
}

export function ArrangeShips({setScene}: ArrangeShipsProps) {
    const {canvasSize} = useContext(AppContext);
    const {lobbyId, playerId} = useContext(IdentityContext);

    const [shipPlacements, setShipPlacements] = useState<ShipPlacements>({
        CARRIER: null,
        BATTLESHIP: null,
        CRUISER: null,
        SUBMARINE: null,
        DESTROYER: null
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const {submitShipArrangement, isPending, isSuccess} = useSubmitShipArrangement();
    const {lobby} = useGetLobbyState(lobbyId, isSuccess);

    const boardSize = canvasSize.height - 2 * boardMargin;
    const boardX = canvasSize.width - (boardSize + boardMargin);

    // ship "beam" size should match the grid size for proper snapping
    const shipSize = boardSize / BOARD_CELLS;

    const checkSnapPoint = (
        shipType: ShipType,
        pos: {x: number, y: number},
        isVertical: boolean
    ): {x: number, y: number} | null => {

        setShipPlacements((prevState) => {
            prevState[shipType] = null;
            return prevState;
        });
        setIsButtonDisabled(!checkAllShipsPlaced(shipPlacements));
        // get the position relative to the top left corner of the board
        const boardRelPos = {
            x: pos.x - boardX,
            y: pos.y - boardMargin
        }

        // quick bounds check
        if (boardRelPos.x < 0 || boardRelPos.x > boardSize) return null;
        if (boardRelPos.y < 0 || boardRelPos.y > boardSize) return null;

        // calculate the ship placement coordinate
        const col = Math.floor(boardRelPos.x / shipSize);
        const row = Math.floor(boardRelPos.y / shipSize);

        // check ship length in range
        const length = getShipLength(shipType);
        if (isVertical && row + length > BOARD_CELLS) return null;
        if (!isVertical && col + length > BOARD_CELLS) return null;

        //TODO: check overlapping ships (backend would do it anyway so it's just for UX)

        // Save ship placement for type
        setShipPlacements(prevState => {
            prevState[shipType] = {col, row, isVertical};
            return prevState;
        });
        setIsButtonDisabled(!checkAllShipsPlaced(shipPlacements));
        // Calculate the position to render the ghost image at
        return {
            x: (col + (isVertical ? 0.5 : 0)) * shipSize + boardX,
            y: (row + (isVertical ? 0 : 0.5)) * shipSize + boardMargin
        };
    }

    const handleAcceptFormation = () => {
        if (isPending || isSuccess) return;

        if (lobbyId && playerId && checkAllShipsPlaced(shipPlacements) ) {
            const arrangedShips = Object.entries(shipPlacements)
                .map(([key, value]) => ({
                    type: key as ShipType,
                    placement: {col: value!.col, row: value!.row},
                    isVertical: value!.isVertical
                }));

            submitShipArrangement({
                identity: {lobbyId, playerId},
                arrangedShips
            })
        }
    }

    useEffect(() => {
        if (isSuccess && lobby && lobby.stage === "battle") {
            setScene("battle_scene");
        }
    }, [isSuccess, lobby, setScene]);
    
    return (
        <>
            <ArrangeShipsRenderer
                hasSubmitted={isSuccess}
                buttonDisabled={isButtonDisabled || isPending}
                boardSize={boardSize}
                handleAcceptFormation={handleAcceptFormation}
            />
            <Board pos={{x: boardX, y: boardMargin}} size={boardSize} showCoordinateLabels={false} />

            {Object.values(ShipType).map((shipType, index) => (
                <DraggableShip shipType={shipType} size={shipSize} checkSnapPoint={checkSnapPoint} startPos={{
                    x: boardMargin,
                    y: boardMargin + (index + 0.5) * shipSize
                }} key={shipType.toLowerCase()} />
            ))}
        </>
    )
}
