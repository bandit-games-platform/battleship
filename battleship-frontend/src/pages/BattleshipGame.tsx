import {CanvasManager} from "../context/CanvasManager.tsx";
import {useEffect, useState} from "react";
import {MainMenu} from "../scenes/MainMenu.tsx";
import {LobbyQueue} from "../scenes/LobbyQueue.tsx";
import {IdentityContext} from "../context/IdentityContext.ts";
import {useSearchParams} from "react-router-dom";
import {ThemeProvider} from "../context/ThemeProvider.tsx";
import {ArrangeShips} from "../scenes/ArrangeShips.tsx";
import {useJoinLobby} from "../hooks/useJoinLobby.ts";
import {Battle} from "../scenes/Battle.tsx";

export function BattleshipGame() {
    const [scene, setScene] = useState<string>("main_menu");
    const [playerId, setPlayerId] = useState<string>("");
    const [lobbyId, setLobbyId] = useState<string | undefined>(undefined);
    const [searchParams, setSearchParams] = useSearchParams();
    const {joinLobby, isPending: joiningLobby, isError: failedToJoinLobby} = useJoinLobby();

    useEffect(() => {
        // playerId should always be provided by the platform when first contacting the host url
        if (searchParams.has("playerId")) {
            setPlayerId(searchParams.get("playerId")!);

            searchParams.delete("playerId");
            setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        // Check for optional lobbyId (set by platform to indicate lobby to join from invites)
        if (playerId && searchParams.has("lobbyId")) {
            joinLobby({ playerId, lobbyId: searchParams.get("lobbyId")! });

            if (!joiningLobby && !failedToJoinLobby) {
                setLobbyId(searchParams.get("lobbyId")!);

                searchParams.delete("lobbyId");
                setSearchParams(searchParams);
            }
        }
    }, [failedToJoinLobby, joinLobby, joiningLobby, playerId, searchParams, setSearchParams]);


    if (playerId === "") {
        return (
            <h1 style={{color: "orangered"}}>Something went wrong. We could not identify you at this time!</h1>
        );
    }

    // Automatically move on from the main menu if we have a lobby defined
    if (lobbyId && scene === "main_menu") {
        setScene("lobby_queue");
    }

    return (
        <IdentityContext.Provider value={{
            playerId: playerId,
            lobbyId: lobbyId
        }}>
            <ThemeProvider>
                <CanvasManager>
                    <>
                        {scene === "main_menu" && <MainMenu setScene={setScene} setLobbyId={setLobbyId} />}
                        {scene === "lobby_queue" && <LobbyQueue setScene={setScene} />}
                        {scene === "arrange_ships" && <ArrangeShips setScene={setScene} />}
                        {scene === "battle_scene" && <Battle setScene={setScene}/>}
                    </>
                </CanvasManager>
            </ThemeProvider>
        </IdentityContext.Provider>
    )
}
