import axios from 'axios';
import {Lobby} from "../model/Lobby.ts";
import {EndStats} from "../model/EndStats.ts";

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

export async function getEndStats(lobbyId: string) {
    const {data: endStats} = await axios.get<EndStats>("/lobby/" + lobbyId + "/end-stats");
    return endStats;
}

export async function resetToggle(playerId: string, lobbyId: string) {
    const {status} = await axios.post("/lobby/" + lobbyId + "/restart", {
        playerId: playerId
    })
    return status
}
