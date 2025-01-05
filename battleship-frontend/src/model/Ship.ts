import {ShipType} from "./ShipType.ts";

export type Ship = {
    shipType: ShipType
    placementCoordinate: {col: number, row: number}
    isVertical: boolean
    shipCoordinate: {col: number, row: number}[]
}