import {useQuery} from "@tanstack/react-query";
import {getBattleStatus} from "../services/BattleService.ts";

export function useGetBattleStatus(playerId: string, lobbyId: string) {
    const {isLoading, isError, data: battleStatus} = useQuery({
        queryKey: ['lobby-player', lobbyId+"-"+playerId],
        queryFn: () => getBattleStatus(playerId, lobbyId),
        refetchInterval: 5000
    })

    return {
        isLoading,
        isError,
        battleStatus
    }
}