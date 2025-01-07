import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.ts";
import {ThemeContext} from "../context/ThemeContext.ts";
import {Assets, Sprite} from "pixi.js";

interface ShotMarkerProps {
    size: number,
    shotPos: {x: number, y: number},
    miss: boolean
}

export function ShotMarker({size, shotPos, miss}: ShotMarkerProps) {
    const {app} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);

    const [shotSprite, setShotSprite] = useState<Sprite>();

    useEffect(() => {
        Assets.load(theme.markers[miss ? "miss": "hit"]).then(res => {
            setShotSprite(new Sprite(res))
        })
    }, [miss, theme.markers]);

    useEffect(() => {
        if (app && app.stage && shotSprite) {
            shotSprite.zIndex = 5
            shotSprite.height = (size / 3) * 2;
            shotSprite.width = (size / 3) * 2;
            shotSprite.anchor.set(0, 0);
            shotSprite.x = shotPos.x + (shotSprite.width / 2 / 2);
            shotSprite.y = shotPos.y + (shotSprite.height / 2 / 2);

            app.stage.addChild(shotSprite);

            return () => {
                app.stage.removeChild(shotSprite);
            }
        }
    }, [app, shotSprite, size, shotPos]);

    return null;
}