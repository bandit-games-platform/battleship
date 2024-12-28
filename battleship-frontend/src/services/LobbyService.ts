import axios from 'axios';
import {Lobby} from "../model/Lobby.ts";

export async function createLobby(ownerId: string) {
    const {data: newLobby} = await axios.post<Lobby>("/lobby", {
        ownerId: ownerId
    })
    return newLobby
}
