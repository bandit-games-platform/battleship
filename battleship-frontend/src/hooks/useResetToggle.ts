import {useMutation} from "@tanstack/react-query";
import {resetToggle} from "../services/LobbyService.ts";

interface ResetToggleParams {
    playerId: string; lobbyId: string
}

export function useResetToggle() {
    const {
        mutateAsync,
        isPending,
        isError,
        status
    } = useMutation({
        mutationFn: ({playerId, lobbyId}: ResetToggleParams) => resetToggle(playerId, lobbyId)
    });

    return {
        isPending,
        isError,
        readyToggle: mutateAsync,
        status
    }
}