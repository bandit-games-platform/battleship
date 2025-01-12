import {useContext, useEffect, useState} from "react";
import {IdentityContext} from "../context/IdentityContext.ts";
import {AppContext} from "../context/AppContext.ts";
import {useGetLobbyState} from "../hooks/useGetLobbyState.ts";
import {useEndStats} from "../hooks/useEndStats.ts";
import {Board, BOARD_CELLS} from "../components/Board.tsx";
import {StaticShip} from "../components/StaticShip.tsx";
import {ShotMarker} from "../components/ShotMarker.tsx";
import {BoardTextRenderer} from "../components/endStage/BoardTextRenderer.tsx";
import {EndRenderer} from "../components/endStage/EndRenderer.tsx";
import {useQueryClient} from "@tanstack/react-query";

interface EndDisplayProps {
    setScene: (scene: string) => void
}

export function EndDisplay({setScene}: EndDisplayProps) {
    const {lobbyId, playerId} = useContext(IdentityContext);
    const {canvasSize} = useContext(AppContext);
    const {lobby} = useGetLobbyState(lobbyId);
    const queryClient = useQueryClient();
    const {stats} = useEndStats(lobbyId? lobbyId: "");
    const [soundPlayed, setSoundPlayed] = useState(false);

    const [spaceBetweenText, setSpaceBetweenText] = useState<number | undefined>()
    const [bottomOfText, setBottomOfText] = useState<number | undefined>()

    useEffect(() => {
        if (lobby) {
            if (lobby.stage === "queueing") {
                queryClient.removeQueries({queryKey: ['lobby-end', lobbyId]});
                setScene("lobby_queue");
            }
        }
    }, [lobby, lobbyId, queryClient, setScene])


    const boardMargin = 10;
    const boardSize = Math.min((spaceBetweenText? spaceBetweenText : canvasSize.height / 2) - boardMargin, canvasSize.width * 0.4);
    const shipSize = boardSize / BOARD_CELLS;

    const boardY = bottomOfText? bottomOfText : canvasSize.height / 2
    const yourBoardX = canvasSize.width / 2 / 2 - boardSize / 2
    const opponentBoardX = canvasSize.width - boardSize - yourBoardX;

    return (
        <>
            <Board pos={{x: yourBoardX, y: boardY}} size={boardSize}/>
            <Board pos={{x: opponentBoardX, y: boardY}} size={boardSize}/>

            {stats && (
                <>
                    <EndRenderer
                        stats={stats}
                        setSoundPlayed={setSoundPlayed}
                        soundPlayed={soundPlayed}
                        setSpaceBetween={setSpaceBetweenText}
                        setBottomOfText={setBottomOfText}
                    />

                    <BoardTextRenderer
                        boardSize={boardSize}
                        playerBoardX={yourBoardX}
                        opponentBoardX={opponentBoardX}
                        boardY={boardY}
                    />

                    {stats.players.map((player) => {
                        let boardPlacementX = 0;
                        let textEnding = "-you";

                        if (player.playerId === playerId) {
                            boardPlacementX = yourBoardX;
                        } else {
                            boardPlacementX = opponentBoardX;
                            textEnding = "-opponent";
                        }

                        return (
                            <div key={player.playerId}>
                                {player.aliveShips.map((ship) => {
                                    const shipYPos = ship.placementCoordinate.row * shipSize + boardY;
                                    const shipXPos = ship.placementCoordinate.col * shipSize + boardPlacementX;
                                    return (
                                        <StaticShip
                                            shipType={ship.shipType}
                                            size={shipSize}
                                            startPos={{x: shipXPos, y: shipYPos}}
                                            vertical={ship.isVertical}
                                            sunk={ship.sunk}
                                            key={ship.shipType.toLowerCase() + "-alive" + textEnding}
                                        />
                                    );
                                })}

                                {player.sunkShips.map((ship) => {
                                    const shipYPos = ship.placementCoordinate.row * shipSize + boardY;
                                    const shipXPos = ship.placementCoordinate.col * shipSize + boardPlacementX;
                                    return (
                                        <StaticShip
                                            shipType={ship.shipType}
                                            size={shipSize}
                                            startPos={{x: shipXPos, y: shipYPos}}
                                            vertical={ship.isVertical}
                                            sunk={ship.sunk}
                                            key={ship.shipType.toLowerCase() + "-sunk" + textEnding}
                                        />
                                    );
                                })}

                                {player.shotsOnBoard.map((shot) => {
                                    const markerYPos = shot.row * shipSize + boardY;
                                    const markerXPos = shot.col * shipSize + boardPlacementX;
                                    return (
                                        <ShotMarker
                                            size={shipSize}
                                            shotPos={{x: markerXPos, y: markerYPos}}
                                            miss={shot.miss}
                                            key={shot.row + "-" + shot.col + "-our" + textEnding}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </>
            )}
        </>
    );
}