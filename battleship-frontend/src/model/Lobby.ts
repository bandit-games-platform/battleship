import {GameState} from "./GameState.ts";
import {Player} from "./Player.ts";

export type Lobby = {
    lobbyId: string
    ownerId: string
    players: Player[]
    stage: "queueing" | "arranging" | "battle" | "finished"
    gameState: GameState
};
