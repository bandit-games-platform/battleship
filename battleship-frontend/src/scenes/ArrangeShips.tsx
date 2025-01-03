import {Board, BOARD_CELLS} from "../components/Board.tsx";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.ts";
import {getShipLength, ShipType} from "../model/ShipType.ts";
import {DraggableShip} from "../components/DraggableShip.tsx";

const boardMargin = 10;

export function ArrangeShips() {
    const {app, canvasSize} = useContext(AppContext);

    const [shipPlacements, setShipPlacements] = useState<{ [key in ShipType]: {col: number, row: number} | null}>({
        CARRIER: null,
        BATTLESHIP: null,
        CRUISER: null,
        SUBMARINE: null,
        DESTROYER: null
    });

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
            prevState[shipType] = {col, row};
            return prevState;
        });
        // Calculate the position to render the ghost image at
        return {
            x: (col + (isVertical ? 0.5 : 0)) * shipSize + boardX,
            y: (row + (isVertical ? 0 : 0.5)) * shipSize + boardMargin
        };
    }

    // TODO: add background and a button to submit the ship formation

    return (
        <>
            <Board pos={{x: boardX, y: boardMargin}} size={boardSize} />

            {Object.values(ShipType).map((shipType, index) => (
                <DraggableShip shipType={shipType} size={shipSize} checkSnapPoint={checkSnapPoint} startPos={{
                    x: boardMargin,
                    y: boardMargin + (index + 0.5) * shipSize
                }} key={shipType.toLowerCase()} />
            ))}
        </>
    )
}
