import {ReactNode, useEffect, useRef} from 'react';
import * as PIXI from 'pixi.js';
import {AppContext} from "./AppContext.ts";
import {resizeCanvas} from "../util/canvasUtils.ts";

interface CanvasManagerProps {
    children: ReactNode;
}

export function CanvasManager({children}: CanvasManagerProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const appRef = useRef<PIXI.Application | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const app = new PIXI.Application({
            view: canvasRef.current,
            width: 1600,
            height: 900,
            backgroundColor: 0x1099bb,
        });

        appRef.current = app;

        const handleResize = () => {
            resizeCanvas(app, 1600, 900);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call to set the canvas size

        return () => {
            window.removeEventListener('resize', handleResize);
            app.destroy(true, { children: true });
        };
    }, []);

    return (
        <AppContext.Provider value={appRef.current}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                margin: 0,
                padding: 0,
                overflow: 'hidden'
            }}>
                <canvas ref={canvasRef}></canvas>
                {children}
            </div>
        </AppContext.Provider>
    );
}
