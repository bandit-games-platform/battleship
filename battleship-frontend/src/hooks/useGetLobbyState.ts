import {useQuery} from "@tanstack/react-query";
import {getLobbyState} from "../services/LobbyService.ts";

export function useGetLobbyState(lobbyId: string | undefined) {
    const {isLoading, isError, data: lobby} = useQuery({
        queryKey: ['lobby', lobbyId],
        queryFn: () => getLobbyState(lobbyId),
        refetchInterval: 5000
    })

    return {
        isLoading,
        isError,
        lobby
    }
}
