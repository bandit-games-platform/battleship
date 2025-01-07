import {useQuery} from "@tanstack/react-query";
import {getLobbyState} from "../services/LobbyService.ts";

export function useGetLobbyState(lobbyId: string | undefined, enabled: boolean = true) {
    const {isLoading, isError, data: lobby} = useQuery({
        queryKey: ['lobby', lobbyId],
        queryFn: () => getLobbyState(lobbyId),
        refetchInterval: 1000,
        enabled: enabled
    })

    return {
        isLoading,
        isError,
        lobby
    }
}
