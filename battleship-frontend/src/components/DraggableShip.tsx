import {getShipLength, ShipType} from "../model/ShipType.ts";
import {useContext, useEffect, useState} from "react";
import {Assets, FederatedPointerEvent, Sprite} from "pixi.js";
import {AppContext} from "../context/AppContext.ts";
import {ThemeContext} from "../context/ThemeContext.ts";

interface DraggableShipProps {
    shipType: ShipType,
    size: number, // "beam" of the ship to match the board grid size
    startPos: {x: number, y: number},
    startVertical?: boolean,
    checkSnapPoint: (shipType: ShipType, pos: {x: number, y: number}, isVertical: boolean) => {x: number, y: number} | null
}

export function DraggableShip({shipType, size, startPos, startVertical = false, checkSnapPoint}: DraggableShipProps) {
    const {app} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);
    
    const [pos, setPos] = useState<{x: number, y: number}>(startPos);
    const [isVertical, setIsVertical] = useState<boolean>(startVertical);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragPointOffset, setDragPointOffset] = useState<{x: number, y: number} | undefined>(undefined);
    const [snapPoint, setSnapPoint] = useState<{x: number, y: number} | null>(null);

    const [shipSprite, setShipSprite] = useState<Sprite>();
    const [ghostSprite, setGhostSprite] = useState<Sprite>();

    useEffect(() => {
        Assets.load(theme.ships[shipType]).then(res => {
            setShipSprite(new Sprite(res))
            setGhostSprite(new Sprite(res))
        })
    }, [shipType, theme.ships]);

    // recheck snapping
    useEffect(() => {
        if(!isDragging) return;
        
        setSnapPoint(checkSnapPoint(shipType, pos, isVertical));
    }, [checkSnapPoint, isDragging, isVertical, pos, shipType]);

    useEffect(() => {
        if (app && app.stage && shipSprite) {
            shipSprite.height = size;
            shipSprite.width = size * getShipLength(shipType);
            shipSprite.anchor.set(0, 0.5);
            shipSprite.x = pos.x;
            shipSprite.y = pos.y;
            shipSprite.angle = isVertical ? 90 : 0;

            if (snapPoint && ghostSprite) {
                ghostSprite.height = size;
                ghostSprite.width = size * getShipLength(shipType);
                ghostSprite.anchor.set(0, 0.5);
                ghostSprite.x = snapPoint.x;
                ghostSprite.y = snapPoint.y;
                ghostSprite.angle = isVertical ? 90 : 0;
                ghostSprite.tint = 0xAAAAAA; // A GHOST!
                ghostSprite.alpha = 0.5;
                app.stage.addChild(ghostSprite);
            }

            const animateSnapBack = (delta: number) => {
                const targetPos = snapPoint ?? startPos;
                if (isVertical && !snapPoint) setIsVertical(false);

                setPos((prevState) => {
                    if (Math.abs(targetPos.x - prevState.x) + Math.abs(targetPos.y - prevState.y) > 10) {
                        return {
                            x: prevState.x + (targetPos.x - prevState.x) * 0.2 * delta,
                            y: prevState.y + (targetPos.y - prevState.y) * 0.2 * delta,
                        };
                    }
                    app.ticker.remove(animateSnapBack);
                    return targetPos;
                })
            }

            const onDragStart = (event: FederatedPointerEvent) => {
                app.ticker.remove(animateSnapBack);
                setIsDragging(true);

                const localPos = event.getLocalPosition(shipSprite.parent);
                setDragPointOffset({
                    x: pos.x - localPos.x,
                    y: pos.y - localPos.y
                });
            }
            
            const onDragEnd = () => {
                setIsDragging(false);
                app.ticker.add(animateSnapBack);
            }

            const onDragMove = (event: FederatedPointerEvent) => {
                if (!isDragging || !dragPointOffset) return;

                const localPos = event.getLocalPosition(shipSprite.parent);
                setPos({
                    x: localPos.x + dragPointOffset.x,
                    y: localPos.y + dragPointOffset.y
                });
            }

            const onKeyDown = (event: KeyboardEvent) => {
                if (event.key.toLowerCase() == 'r' && isDragging) {
                    setIsVertical(!isVertical);
                }
            }

            shipSprite.cursor = 'pointer';
            shipSprite.eventMode = 'static';
            shipSprite
                .on('pointerdown', onDragStart)
                .on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('globalpointermove', onDragMove);

            app.stage.addChild(shipSprite);

            window.addEventListener('keydown', onKeyDown);
            
            return () => {
                window.removeEventListener('keydown', onKeyDown);
                shipSprite
                    .off('pointerdown', onDragStart)
                    .off('pointerup', onDragEnd)
                    .off('pointerupoutside', onDragEnd)
                    .off('globalpointermove', onDragMove);
                app.stage.removeChild(shipSprite);
                if (ghostSprite) app.stage.removeChild(ghostSprite);
            }
        }
    }, [app, dragPointOffset, ghostSprite, isDragging, isVertical, pos, shipSprite, shipType, size, snapPoint, startPos]);

    return null;
}
