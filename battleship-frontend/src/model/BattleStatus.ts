import {Ship} from "./Ship.ts";

export type BattleStatus = {
    lobbyId: string
    playerId: string
    ourAliveShips: Ship[]
    ourSunkShips: Ship[]
    shotsOnOurShips: {col: number, row: number, miss: boolean}[]

    opponentAliveShips: number
    sunkOpponentsShips: Ship[]
    shotsOnOpponentShips: {col: number, row: number, miss: boolean}[]
}