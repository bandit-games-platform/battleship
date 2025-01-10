import {Ship} from "./Ship.ts";
import {IdentityDto} from "./IdentityDto.ts";

export type BattleStatus = {
    identity: IdentityDto
    ourAliveShips: Ship[]
    ourSunkShips: Ship[]
    shotsOnOurShips: {col: number, row: number, miss: boolean}[]

    opponentAliveShips: number
    sunkOpponentsShips: Ship[]
    shotsOnOpponentShips: {col: number, row: number, miss: boolean}[]

    turnOf: string
}