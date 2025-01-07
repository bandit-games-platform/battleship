import {useQuery} from "@tanstack/react-query";
import {getEndStats} from "../services/LobbyService.ts";

export function useEndStats(lobbyId: string) {
    const {isLoading, isError, data: stats} = useQuery({
        queryKey: ['lobby-end', lobbyId],
        queryFn: () => getEndStats(lobbyId)
    })

    return {
        isLoading,
        isError,
        stats
    }
}