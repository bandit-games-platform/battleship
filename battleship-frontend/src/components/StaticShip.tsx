import {getShipLength, ShipType} from "../model/ShipType.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.ts";
import {ThemeContext} from "../context/ThemeContext.ts";
import {Assets, Sprite} from "pixi.js";

interface StaticShipProps {
    shipType: ShipType,
    size: number, // "beam" of the ship to match the board grid size
    startPos: {x: number, y: number},
    vertical: boolean,
    sunk: boolean
}

export function StaticShip({shipType, size, startPos, vertical, sunk}: StaticShipProps) {
    const {app} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);

    const [shipSprite, setShipSprite] = useState<Sprite>();

    useEffect(() => {
        Assets.load(theme.ships[shipType]).then(res => {
            setShipSprite(new Sprite(res))
        })
    }, [shipType, theme.ships]);

    useEffect(() => {
        if (app && app.stage && shipSprite) {
            shipSprite.height = size;
            shipSprite.width = size * getShipLength(shipType);
            shipSprite.anchor.set(0, 0.5);
            shipSprite.x = startPos.x + (vertical? size/2 : 0);
            shipSprite.y = startPos.y + (vertical? 0 : size/2);
            shipSprite.angle = vertical ? 90 : 0;

            if (sunk) shipSprite.tint = 0xEE4B2B

            app.stage.addChild(shipSprite);

            return () => {
                app.stage.removeChild(shipSprite);
            }
        }
    }, [app, shipSprite, shipType, size, startPos, sunk, vertical]);

    return null;
}