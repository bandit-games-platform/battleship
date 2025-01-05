import {Board, BOARD_CELLS} from "../components/Board.tsx";
import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.ts";
import * as PIXI from "pixi.js";
import {IdentityContext} from "../context/IdentityContext.ts";
import {useGetLobbyState} from "../hooks/useGetLobbyState.ts";
import {Lobby} from "../model/Lobby.ts";
import {GeneralStatusCheck} from "../utils/generalStatusCheck.ts";
import {useGetBattleStatus} from "../hooks/useGetBattleStatus.ts";
import {StaticShip} from "../components/StaticShip.tsx";
import {ShotMarker} from "../components/ShotMarker.tsx";

interface BattleProps {
    setScene: (scene: string) => void
}

interface BattleRendererProps {
    lobby: Lobby
    lobbyLoading: boolean
    lobbyError: boolean
    boardMargin: number
    boardSize: number
}

function BattleRenderer({lobby, lobbyLoading, lobbyError, boardMargin, boardSize}: BattleRendererProps) {
    const {app, canvasSize} = useContext(AppContext);

    useEffect(() => {
        if (app && app.stage) {
            const background = new PIXI.Graphics();
            background.beginFill(0x5F9EA0);
            background.drawRect(0, 0, canvasSize.width, canvasSize.height);
            background.endFill();
            app.stage.addChild(background);

            if (lobbyLoading || !lobby || lobbyError) {
                return GeneralStatusCheck({object: lobby, objectLoading: lobbyLoading, objectError: lobbyError, objectString: "lobby", app})
            }

            const yourBoardText = new PIXI.Text("Your Ships", { fontSize: 40, fill: '#191970', fontFamily: "Impact" });
            yourBoardText.anchor.set(0.5);
            yourBoardText.x = boardSize / 2 + boardMargin;
            yourBoardText.y = (canvasSize.height - boardSize) / 2 / 2;
            app.stage.addChild(yourBoardText);

            const opponentBoardText = new PIXI.Text("Your Shots", { fontSize: 40, fill: '#191970', fontFamily: "Impact" });
            opponentBoardText.anchor.set(0.5);
            opponentBoardText.x = canvasSize.width - boardSize / 2 - boardMargin;
            opponentBoardText.y = (canvasSize.height - boardSize) / 2 / 2;
            app.stage.addChild(opponentBoardText);

            return () => {
                app.stage.removeChild(background);
                app.stage.removeChild(yourBoardText);
                app.stage.removeChild(opponentBoardText);

                background.destroy(true);
                yourBoardText.destroy(true);
                opponentBoardText.destroy(true);
            }
        }
    }, [app, canvasSize, lobby, lobbyError, lobbyLoading]);

    return null;

}

export function Battle({setScene}: BattleProps) {
    const {canvasSize} = useContext(AppContext);
    const {lobbyId, playerId} = useContext(IdentityContext);
    const {lobby, isLoading: lobbyLoading, isError: lobbyError} = useGetLobbyState(lobbyId);
    const {battleStatus} = useGetBattleStatus(playerId, lobbyId?lobbyId:"")

    useEffect(() => {
        console.log(lobby)
        if (lobby) {
            if (lobby.stage === "finished") {
                setScene("end_state")
            }
            if (lobby.stage !== "battle") {
                setScene("arrange_ships");
            }
        }
    }, [lobby, setScene])

    useEffect(() => {
        console.log(battleStatus)
    }, [battleStatus])

    const boardMargin = 20;
    const boardSize = (canvasSize.width / 2) - boardMargin * 3;
    const shipSize = boardSize / BOARD_CELLS;

    const boardY = canvasSize.height / 2 - boardSize / 2
    const yourBoardX = boardMargin
    const opponentBoardX = canvasSize.width - (boardSize + boardMargin);

    return (
        <>
            <BattleRenderer
                lobby={lobby!}
                lobbyError={lobbyError}
                lobbyLoading={lobbyLoading}
                boardMargin={boardMargin}
                boardSize={boardSize}
            />
            {!lobbyLoading && !lobbyError && (
                <>
                    <Board pos={{x: yourBoardX, y: boardY}} size={boardSize}/>
                    <Board pos={{x: opponentBoardX, y: boardY}} size={boardSize}/>

                    {battleStatus && (
                        <>
                            {battleStatus.ourAliveShips.map((ship) => {
                                const shipYPos = ship.placementCoordinate.row * shipSize + boardY;
                                const shipXPos = ship.placementCoordinate.col * shipSize + yourBoardX;
                                return (
                                    <StaticShip
                                        shipType={ship.shipType}
                                        size={shipSize}
                                        startPos={{x: shipXPos, y: shipYPos}}
                                        vertical={ship.isVertical}
                                        sunk={ship.sunk}
                                        key={ship.shipType.toLowerCase() + "-alive"}
                                    />
                                );
                            })}

                            {battleStatus.ourSunkShips.map((ship) => {
                                const shipYPos = ship.placementCoordinate.row * shipSize + boardY;
                                const shipXPos = ship.placementCoordinate.col * shipSize + yourBoardX;
                                return (
                                    <StaticShip
                                        shipType={ship.shipType}
                                        size={shipSize}
                                        startPos={{x: shipXPos, y: shipYPos}}
                                        vertical={ship.isVertical}
                                        sunk={ship.sunk}
                                        key={ship.shipType.toLowerCase() + "-sunk"}
                                    />
                                );
                            })}

                            {battleStatus.shotsOnOurShips.map((shot) => {
                                const markerYPos = shot.row * shipSize + boardY;
                                const markerXPos = shot.col * shipSize + yourBoardX;
                                return (
                                    <ShotMarker
                                        size={shipSize}
                                        shotPos={{x: markerXPos, y: markerYPos}}
                                        miss={shot.miss}
                                        key={shot.row + "-" + shot.col + "-our"}
                                    />
                                )
                            })}

                            {battleStatus.sunkOpponentsShip.map((ship) => {
                                const shipYPos = ship.placementCoordinate.row * shipSize + boardY;
                                const shipXPos = canvasSize.width - (boardSize + boardMargin) + ship.placementCoordinate.col * shipSize;
                                return (
                                    <StaticShip
                                        shipType={ship.shipType}
                                        size={shipSize}
                                        startPos={{x: shipXPos, y: shipYPos}}
                                        vertical={ship.isVertical}
                                        sunk={ship.sunk}
                                        key={ship.shipType.toLowerCase() + "-sunk-opponent"}
                                    />
                                );
                            })}

                            {battleStatus.shotsOnOpponentShips.map((shot) => {
                                const markerYPos = shot.row * shipSize + boardY;
                                const markerXPos = shot.col * shipSize + opponentBoardX;
                                return (
                                    <ShotMarker
                                        size={shipSize}
                                        shotPos={{x: markerXPos, y: markerYPos}}
                                        miss={shot.miss}
                                        key={shot.row + "-" + shot.col + "-enemy"}
                                    />
                                )
                            })}
                        </>
                    )}
                </>
            )}
        </>
    )
}