
export enum ShipType {
    CARRIER = "CARRIER",
    BATTLESHIP = "BATTLESHIP",
    CRUISER = "CRUISER",
    SUBMARINE = "SUBMARINE",
    DESTROYER = "DESTROYER"
}

const shipLengths: { [key in ShipType]: number } = {
    [ShipType.CARRIER]: 5,
    [ShipType.BATTLESHIP]: 4,
    [ShipType.CRUISER]: 3,
    [ShipType.SUBMARINE]: 3,
    [ShipType.DESTROYER]: 2,
};

export function getShipLength(shipType: ShipType): number {
    return shipLengths[shipType];
}
