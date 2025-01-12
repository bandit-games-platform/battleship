
import {createLobby} from "../services/LobbyService.ts";
import {useMutation} from "@tanstack/react-query";

interface CreateLobbyParams {
    ownerId: string,
    themeIndex: number
}

export function useCreateLobby() {
    const {
        mutate,
        isPending,
        isError
    } = useMutation({
        mutationFn: ({ownerId, themeIndex}: CreateLobbyParams) => createLobby(ownerId, themeIndex)
    });

    return {
        isPending,
        isError,
        createLobby: mutate
    }
}
