import {Player} from "./Player.ts";

export type Lobby = {
    lobbyId: string
    ownerId: string
    players: Player[]
    stage: "queueing" | "arranging" | "battle" | "finished"
    turnOf: string
};
