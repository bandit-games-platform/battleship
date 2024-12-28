
import {createLobby} from "../services/LobbyService.ts";
import {useMutation} from "@tanstack/react-query";

export function useCreateLobby() {
    const {
        mutate,
        isPending,
        isError
    } = useMutation({
        mutationFn: (ownerId: string) => createLobby(ownerId)
    });

    return {
        isPending,
        isError,
        createLobby: mutate
    }
}
