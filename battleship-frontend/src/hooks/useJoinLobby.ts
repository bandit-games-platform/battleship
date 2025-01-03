import {useMutation} from "@tanstack/react-query";
import {joinLobby} from "../services/LobbyService.ts";

interface JoinLobbyParams {
    playerId: string; lobbyId: string
}

export function useJoinLobby() {
    const {
        mutate,
        isPending,
        isError
    } = useMutation({
        mutationFn: ({playerId, lobbyId}: JoinLobbyParams) => joinLobby(playerId, lobbyId)
    });

    return {
        isPending,
        isError,
        joinLobby: mutate
    }
}