import {ReactNode, useEffect, useRef, useState} from 'react';
import * as PIXI from 'pixi.js';
import {AppContext} from "./AppContext.ts";

interface CanvasManagerProps {
    children: ReactNode;
}

const defaultWidth = 1600;
const defaultHeight = 900;

export function CanvasManager({children}: CanvasManagerProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [app, setApp] = useState<PIXI.Application | null>(null);
    const [canvasSize, setCanvasSize] = useState<{width: number, height: number}>({width: window.innerWidth, height: window.innerHeight});

    useEffect(() => {
        if (!canvasRef.current) return;

        const app = new PIXI.Application({
            view: canvasRef.current,
            width: defaultWidth,
            height: defaultHeight,
            backgroundColor: 0xff00ff,
        });

        setApp(app);

        const handleResize = () => {
            const ratio = Math.min(window.innerWidth / defaultWidth, window.innerHeight / defaultHeight);

            const newWidth = defaultWidth * ratio;
            const newHeight = defaultHeight * ratio

            app.renderer.resize(newWidth, newHeight);

            setCanvasSize({width: newWidth, height: newHeight})
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call to set the canvas size

        return () => {
            window.removeEventListener('resize', handleResize);
            app.destroy(true, { children: true });
        };
    }, []);

    return (
        <AppContext.Provider value={{
            app: app,
            canvasSize: canvasSize
        }}>
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
