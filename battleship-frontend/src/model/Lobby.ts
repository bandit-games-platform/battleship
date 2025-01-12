import {Player} from "./Player.ts";

export type Lobby = {
    lobbyId: string
    ownerId: string
    themeIndex: number
    players: Player[]
    stage: "queueing" | "arranging" | "battle" | "finished"
};
