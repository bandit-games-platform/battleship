import {GameState} from "./GameState.ts";

export type Lobby = {
    lobbyId: string
    ownerId: string
    players: string[]
    stage: "queueing" | "arranging" | "battle" | "finished"
    playerHasReadied: boolean
    gameState: GameState
};
