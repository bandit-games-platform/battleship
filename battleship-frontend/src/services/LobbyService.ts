import axios from 'axios';
import {Lobby} from "../model/Lobby.ts";

export async function createLobby(ownerId: string) {
    const {data: newLobby} = await axios.post<Lobby>("/lobby", {
        ownerId: ownerId
    })
    return newLobby
}

export async function joinLobby(playerId: string, lobbyId: string) {
    const {data: lobby} = await axios.post<Lobby>("/lobby/" + lobbyId + "/join", {
        playerId: playerId
    })
    return lobby
}

export async function getLobbyState(lobbyId: string | undefined) {
    if (!lobbyId) return null;

    const {data: lobby} = await axios.get<Lobby>("/lobby/" + lobbyId);
    return lobby;
}

export async function readyToggle(playerId: string, lobbyId: string) {
    const {data: lobby} = await axios.post<Lobby>("/lobby/" + lobbyId + "/ready", {
        playerId: playerId
    })
    return lobby
}
