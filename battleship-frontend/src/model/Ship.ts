import {ShipType} from "./ShipType.ts";

export type Ship = {
    shipType: ShipType
    placementCoordinate: {col: number, row: number}
    isVertical: boolean
    sunk: boolean
    shipCoordinates: {col: number, row: number}[]
}