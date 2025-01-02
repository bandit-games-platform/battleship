import {useMutation, useQueryClient} from "@tanstack/react-query";
import {readyToggle} from "../services/LobbyService.ts";

interface ReadyToggleParams {
    playerId: string; lobbyId: string
}

export function useReadyToggle() {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending,
        isError,
        data: lobby
    } = useMutation({
        mutationFn: ({playerId, lobbyId}: ReadyToggleParams) => readyToggle(playerId, lobbyId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: ['lobby', variables.lobbyId]});
        }
    });

    return {
        isPending,
        isError,
        readyToggle: mutate,
        lobby
    }
}