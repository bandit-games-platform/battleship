import {Board, BOARD_CELLS} from "../components/Board.tsx";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.ts";
import * as PIXI from "pixi.js";
import {IdentityContext} from "../context/IdentityContext.ts";
import {useGetLobbyState} from "../hooks/useGetLobbyState.ts";
import {Lobby} from "../model/Lobby.ts";
import {GeneralStatusCheck} from "../utils/generalStatusCheck.ts";
import {useGetBattleStatus} from "../hooks/useGetBattleStatus.ts";
import {StaticShip} from "../components/StaticShip.tsx";
import {ShotMarker} from "../components/ShotMarker.tsx";
import {ClickableBattleArea} from "../components/ClickableBattleArea.tsx";
import {ExplosionSprite} from "../components/effects/ExplosionSprite.tsx";
import {SplashSprite} from "../components/effects/SplashSprite.tsx";
import {NewShotDisplay} from "../components/NewShotDisplay.tsx";
import {ThemeContext} from "../context/ThemeContext.ts";
import {Sprite} from "pixi.js";
import {useQueryClient} from "@tanstack/react-query";

interface BattleProps {
    setScene: (scene: string) => void
}

interface BattleRendererProps {
    lobby: Lobby
    lobbyLoading: boolean
    lobbyError: boolean
    boardMargin: number
    boardSize: number,
    toggleBackgroundMusic: () => void,
    musicPlaying: boolean,
    turnOf: string
}

function BattleRenderer({lobby, lobbyLoading, lobbyError, boardMargin, boardSize, toggleBackgroundMusic, musicPlaying, turnOf}: BattleRendererProps) {
    const {app, canvasSize} = useContext(AppContext);
    const {playerId} = useContext(IdentityContext);
    const {theme} = useContext(ThemeContext);
    const [musicIcon, setMusicIcon] = useState(musicPlaying ? theme.music_icons.unmuted : theme.music_icons.muted);

    useEffect(() => {
        const toggleMusic = () => {
            if (musicIcon === theme.music_icons.unmuted) {
                setMusicIcon(theme.music_icons.muted)
            } else {
                setMusicIcon(theme.music_icons.unmuted)
            }
            toggleBackgroundMusic()
        }

        if (app && app.stage) {
            app.stage.sortableChildren = true;

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

            const turnText = new PIXI.Text("Turn", { fontSize: 40, fill: '#097969', fontFamily: "Impact" })
            if (turnOf == "null") {
                turnText.text = "Loading battle status..."
            }else if (turnOf != playerId) {
                turnText.text = "Waiting for Opponent's Shot...."
            } else {
                turnText.text = "It's your turn!"
            }
            turnText.anchor.set(0.5);
            turnText.x = canvasSize.width / 2;
            turnText.y = (boardSize + (canvasSize.height - boardSize)) - turnText.height;
            app.stage.addChild(turnText);

            const musicIconDisplay = Sprite.from(musicIcon);
            musicIconDisplay.anchor.set(0.5)
            musicIconDisplay.height = (canvasSize.width / 25)
            musicIconDisplay.width = (canvasSize.width / 25)
            musicIconDisplay.x = canvasSize.width - (musicIconDisplay.width / 2) - 5
            musicIconDisplay.y = musicIconDisplay.height / 2
            musicIconDisplay.eventMode = 'static';
            musicIconDisplay.cursor = 'pointer';

            if (musicIcon === theme.music_icons.muted) {
                musicIconDisplay.tint = 0xEE4B2B
            }

            musicIconDisplay
                .on("pointerdown", toggleMusic);
            app.stage.addChild(musicIconDisplay);

            return () => {
                app.stage.removeChild(background);
                app.stage.removeChild(yourBoardText);
                app.stage.removeChild(opponentBoardText);
                app.stage.removeChild(turnText);
                app.stage.removeChild(musicIconDisplay);

                background.destroy(true);
                yourBoardText.destroy(true);
                opponentBoardText.destroy(true);
                turnText.destroy(true);
                musicIconDisplay.destroy(true);

                musicIconDisplay.off("pointerdown", toggleMusic)
            }
        }
    }, [app, boardMargin, boardSize, canvasSize, lobby, lobbyError, lobbyLoading, musicIcon, playerId, theme.music_icons.muted, theme.music_icons.unmuted, toggleBackgroundMusic, turnOf]);

    return null;

}

export function Battle({setScene}: BattleProps) {
    const {canvasSize} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);
    const {lobbyId, playerId} = useContext(IdentityContext);
    const queryClient = useQueryClient();

    const {lobby, isLoading: lobbyLoading, isError: lobbyError} = useGetLobbyState(lobbyId);
    const [explosionPosition, setExplosionPosition] = useState({col: -1, row: -1})
    const [showExplosion, setShowExplosion] = useState(false);
    const [splashPosition, setSplashPosition] = useState({col: -1, row: -1})
    const [showSplash, setShowSplash] = useState(false);
    const [previousHitsOnFleet, setPreviousHitsOnFleet] = useState<{col: number, row: number, miss: boolean}[]>()
    const [newHits, setNewHits] = useState<{col: number, row: number, miss: boolean}[]>()
    const {battleStatus} = useGetBattleStatus(playerId, lobbyId?lobbyId:"")

    const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement>();
    const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(() => {
            const unmuted = sessionStorage.getItem("music-unmuted-"+playerId);
            return unmuted ? JSON.parse(unmuted) : true;
        }
    );

    useEffect(() => {
        const backgroundMusicAudio = new Audio(theme.sounds.battle_music);
        backgroundMusicAudio.loop = true;
        backgroundMusicAudio.volume = 0.1;
        setBackgroundMusic(backgroundMusicAudio);
    }, [theme.sounds])

    const toggleBackgroundMusic = () => {
        setBackgroundMusicPlaying(!backgroundMusicPlaying);
        sessionStorage.setItem("music-unmuted-"+playerId, String(!backgroundMusicPlaying))
    }

    useEffect(() => {
        if (backgroundMusic) {
            if (backgroundMusicPlaying) {
                backgroundMusic.play()
            } else {
                backgroundMusic.pause()
            }
        }
    }, [backgroundMusic, backgroundMusicPlaying]);

    const toggleExplosion = () => {
        setShowExplosion(!showExplosion)
    }

    const toggleSplash = () => {
        setShowSplash(!showSplash)
    }

    const compareShotArrays = (
        knownHits: { col: number; row: number; miss: boolean }[],
        currentHits: { col: number; row: number; miss: boolean }[]
    ) => {
        const newEntries = currentHits.filter(
            (hit) =>
                !knownHits.some(
                    (knownHit) =>
                        hit.col === knownHit.col &&
                        hit.row === knownHit.row &&
                        hit.miss === knownHit.miss
                )
        );

        const areDifferent = newEntries.length > 0;

        return { areDifferent, newEntries };
    }

    const removeHit = (shotToRemove: { col: number; row: number; miss: boolean }) => {
        if (newHits) {
            setNewHits(() =>
                newHits.filter(
                    (shot) =>
                        shot.col !== shotToRemove.col ||
                        shot.row !== shotToRemove.row ||
                        shot.miss !== shotToRemove.miss
                )
            );
        }
    };

    useEffect(() => {
        if (lobby) {
            if (lobby.stage === "finished") {
                if (backgroundMusic) {
                    backgroundMusic.pause();
                    backgroundMusic.remove();
                }
                queryClient.removeQueries({queryKey: ['lobby-player', lobbyId+"-"+playerId]});
                setScene("end_state")
            }
        }
    }, [backgroundMusic, lobby, lobbyId, playerId, queryClient, setScene])

    useEffect(() => {
        if (battleStatus) {
            const currentHits = battleStatus.shotsOnOurShips;

            const {areDifferent, newEntries} = compareShotArrays(
                previousHitsOnFleet || [],
                currentHits
            )

            if (areDifferent) {
                setNewHits(newEntries);
                setPreviousHitsOnFleet(currentHits);
            }
        }
    }, [battleStatus, previousHitsOnFleet])

    const boardMargin = 30;
    const boardSize = (canvasSize.width / 2) - boardMargin * 3;
    const shipSize = boardSize / BOARD_CELLS;

    const boardY = canvasSize.height / 2 - boardSize / 2
    const yourBoardX = boardMargin
    const opponentBoardX = canvasSize.width - (boardSize + boardMargin);

    useEffect(() => {
        const playAudio = async (miss: boolean) => {
            if (miss) {
                const missAudio = new Audio(theme.sounds.miss);
                await missAudio.play();
                missAudio.remove();
            } else {
                const hitAudio = new Audio(theme.sounds.hit);
                await hitAudio.play();
                hitAudio.remove();
            }
        }

        if (newHits) {
            newHits.forEach((shot) => {
                if (shot.miss) {
                    playAudio(true);
                    const splashX = yourBoardX + (shot.col * shipSize) + shipSize / 2;
                    const splashY = boardY + (shot.row * shipSize) + shipSize / 2;
                    setSplashPosition({col: splashX, row: splashY});
                    setShowSplash(true);
                } else {
                    playAudio(false);
                    const explosionX = yourBoardX + (shot.col * shipSize) + shipSize / 2;
                    const explosionY = boardY + (shot.row * shipSize) + shipSize / 2;
                    setExplosionPosition({col: explosionX, row: explosionY});
                    setShowExplosion(true);
                }
            });
        }
    }, [boardY, newHits, shipSize, theme.sounds, yourBoardX]);

    return (
        <>
            <BattleRenderer
                lobby={lobby!}
                lobbyError={lobbyError}
                lobbyLoading={lobbyLoading}
                boardMargin={boardMargin}
                boardSize={boardSize}
                toggleBackgroundMusic={toggleBackgroundMusic}
                musicPlaying={backgroundMusicPlaying}
                turnOf={battleStatus? battleStatus.turnOf: "null"}
            />

            {!lobbyLoading && !lobbyError && (
                <>
                    <Board pos={{x: yourBoardX, y: boardY}} size={boardSize}/>
                    <Board pos={{x: opponentBoardX, y: boardY}} size={boardSize}/>

                    {battleStatus && (
                        <>
                            {newHits && newHits.map((shot) => (
                                <NewShotDisplay
                                    shot={shot}
                                    key={shot.col + "-" + shot.row}
                                    onDisplayComplete={() => removeHit(shot)}
                                />
                            ))}

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

                            {battleStatus.sunkOpponentsShips.map((ship) => {
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

                    {battleStatus && lobby && (
                        <ClickableBattleArea
                            pos={{x: opponentBoardX, y: boardY}}
                            size={boardSize}
                            squareSize={shipSize}
                            lobby={lobby}
                            battleStatus={battleStatus}
                            showHitMarker={(col: number, row: number) => {
                                const explosionX = opponentBoardX + (col * shipSize) + shipSize / 2
                                const explosionY = boardY + (row * shipSize) + shipSize / 2
                                setExplosionPosition({col: explosionX, row: explosionY});
                                setShowExplosion(true);
                                battleStatus.shotsOnOpponentShips.push({col, row, miss: false});
                            }}
                            showMissMarker={(col: number, row: number) => {
                                const splashX = opponentBoardX + (col * shipSize) + shipSize / 2
                                const splashY = boardY + (row * shipSize) + shipSize / 2
                                setSplashPosition({col: splashX, row: splashY});
                                setShowSplash(true);
                                battleStatus.shotsOnOpponentShips.push({col, row, miss: true});
                            }}
                        />
                    )}

                    <ExplosionSprite
                        x={explosionPosition.col}
                        y={explosionPosition.row}
                        show={showExplosion}
                        toggleShow={toggleExplosion}
                    />

                    <SplashSprite
                        x={splashPosition.col}
                        y={splashPosition.row}
                        show={showSplash}
                        toggleShow={toggleSplash}
                    />
                </>
            )}
        </>
    )
}