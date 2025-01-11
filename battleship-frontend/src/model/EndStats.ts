import {Ship} from "./Ship.ts";

export type EndStats = {
    winningPlayer: string
    players: {
       playerId: string,
       aliveShips: Ship[],
       sunkShips: Ship[],
       shotsOnBoard: {col: number, row: number, miss: boolean}[]
    }[]
}