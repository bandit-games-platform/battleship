import {IdentityDto} from "./IdentityDto.ts";
import {ShipType} from "./ShipType.ts";

export type SubmitArrangementDto = {
    identity: IdentityDto,
    arrangedShips: {
        type: ShipType,
        placement: {col: number, row: number},
        isVertical: boolean
    }[]
}
