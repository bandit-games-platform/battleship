import {useContext, useEffect, useRef, useState} from 'react';
import * as PIXI from 'pixi.js';
import {AnimatedSprite, Assets, FederatedPointerEvent, Sprite} from 'pixi.js';
import {AppContext} from "../context/AppContext.ts";
import {useCreateLobby} from "../hooks/useCreateLobby.ts";
import {IdentityContext} from "../context/IdentityContext.ts";
import {SettingsMenu} from "../components/SettingsMenu.tsx";
import {ThemeContext} from "../context/ThemeContext.ts";
import {splitAnimationFrames} from "../utils/textureSplitter.ts";

interface MainMenuProps {
    setScene: (scene: string) => void
    setLobbyId: (lobbyId: string) => void
}

export function MainMenu({ setScene, setLobbyId }: MainMenuProps) {
    const {app, canvasSize} = useContext(AppContext);
    const {theme} = useContext(ThemeContext);
    const {playerId} = useContext(IdentityContext);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

    const {createLobby, isPending: creatingLobby, isError: failedToCreateLobby} = useCreateLobby();
    
    const animTime = useRef<number>(0);
    const [bgBaseSprite, setBgBaseSprite] = useState<Sprite>();
    const [bgOverlayAnim, setBgOverlayAnim] = useState<AnimatedSprite>();
    const [fgBaseSprite, setFgBaseSprite] = useState<Sprite>();
    const [fgMouseFollowSprite, setFgMouseFollowSprite] = useState<Sprite>();
    const [fgTopSprite, setFgTopSprite] = useState<Sprite>();
    const mousePos = useRef<{x: number, y: number}>({x: canvasSize.width/2, y: canvasSize.height/2});

    const buttonWidth = canvasSize.width*0.2;
    const buttonHeight = buttonWidth/4;
    const buttonFontSize = buttonHeight * 0.45;
    const firstButtonY = canvasSize.height/2 - buttonHeight/2;

    useEffect(() => {
        Assets.load(theme.main_menu.background_static_base).then(res => {
            setBgBaseSprite(new Sprite(res));
        });
        splitAnimationFrames(theme.main_menu.background_overlay_anim).then(res => {
            const anim = new AnimatedSprite(res.frames);
            anim.animationSpeed = theme.main_menu.background_overlay_anim.speed ?? 0.1;
            anim.loop = true;
            anim.play();
            setBgOverlayAnim(anim);
        })
        Assets.load(theme.main_menu.foreground_static_base).then(res => {
            setFgBaseSprite(new Sprite(res));
        });
        Assets.load(theme.main_menu.foreground_mousefollow.static_asset).then(res => {
            setFgMouseFollowSprite(new Sprite(res));
        });
        Assets.load(theme.main_menu.foreground_static_top).then(res => {
            setFgTopSprite(new Sprite(res));
        });

    }, [theme.main_menu]);

    useEffect(() => {
        if (app && app.stage && bgBaseSprite && fgBaseSprite && fgTopSprite && fgMouseFollowSprite && bgOverlayAnim) {
            app.stage.sortableChildren = true;
            const wave_anim = theme.main_menu.wave_anim;
            const mousefollow = theme.main_menu.foreground_mousefollow;

            bgBaseSprite.zIndex = -100;
            bgBaseSprite.anchor.set(0.5);
            bgBaseSprite.x = canvasSize.width/2;
            bgBaseSprite.y = canvasSize.height/2;
            const backgroundScalingFactor =  (1 + wave_anim.offset_amplitude.background * 2);
            bgBaseSprite.width = canvasSize.width * backgroundScalingFactor;
            bgBaseSprite.height = canvasSize.height * backgroundScalingFactor;
            app.stage.addChild(bgBaseSprite);

            bgOverlayAnim.zIndex = -80;
            bgOverlayAnim.anchor.set(0.5);
            bgOverlayAnim.x = canvasSize.width/2;
            bgOverlayAnim.y = canvasSize.height/2;
            bgOverlayAnim.width = canvasSize.width * backgroundScalingFactor;
            bgOverlayAnim.height = canvasSize.height * backgroundScalingFactor;
            app.stage.addChild(bgOverlayAnim);


            fgBaseSprite.zIndex = -50;
            fgBaseSprite.anchor.set(0.5);
            fgBaseSprite.x = canvasSize.width/2;
            fgBaseSprite.y = canvasSize.height/2;
            const foregroundScalingFactor =  (1 + wave_anim.offset_amplitude.foreground * 2);
            fgBaseSprite.height = canvasSize.height * foregroundScalingFactor;
            fgBaseSprite.width = canvasSize.width * foregroundScalingFactor;
            app.stage.addChild(fgBaseSprite);

            fgMouseFollowSprite.zIndex = -40;
            fgMouseFollowSprite.anchor.set(0.5);
            fgMouseFollowSprite.width = fgMouseFollowSprite.texture.width * fgBaseSprite.scale.x;
            fgMouseFollowSprite.height = fgMouseFollowSprite.texture.height * fgBaseSprite.scale.y;
            fgMouseFollowSprite.angle = (mousefollow.angle.min + mousefollow.angle.max)/2;

            const updateMousePos = (event: FederatedPointerEvent) => mousePos.current = event.getLocalPosition(fgMouseFollowSprite.parent);
            fgMouseFollowSprite.eventMode = 'static';
            fgMouseFollowSprite.on('globalpointermove', updateMousePos);
            app.stage.addChild(fgMouseFollowSprite);

            fgTopSprite.zIndex = -30;
            fgTopSprite.anchor.set(0.5);
            fgTopSprite.x = canvasSize.width/2;
            fgTopSprite.y = canvasSize.height/2;
            fgTopSprite.height = canvasSize.height * foregroundScalingFactor;
            fgTopSprite.width = canvasSize.width * foregroundScalingFactor;
            app.stage.addChild(fgTopSprite);

            const animate = (delta: number) => {
                animTime.current += delta;
                // Wave animation
                const offset = wave_anim.wave_function(animTime.current);
                const backgroundY = canvasSize.height/2 + offset * wave_anim.offset_amplitude.background * canvasSize.height;
                bgBaseSprite.y = backgroundY;
                bgOverlayAnim.y = backgroundY;
                const foregroundY = canvasSize.height/2 - offset * wave_anim.offset_amplitude.foreground * canvasSize.height;
                fgBaseSprite.y = foregroundY;
                fgTopSprite.y = foregroundY;

                // Mouse follow animation
                fgMouseFollowSprite.x = fgBaseSprite.x + (mousefollow.pos.x-fgBaseSprite.texture.width/2) * fgBaseSprite.scale.x / foregroundScalingFactor;
                fgMouseFollowSprite.y = fgBaseSprite.y + (mousefollow.pos.y-fgBaseSprite.texture.height/2) * fgBaseSprite.scale.y / foregroundScalingFactor;

                const mouseAngleRads = Math.atan2(mousePos.current.y - fgMouseFollowSprite.y, mousePos.current.x - fgMouseFollowSprite.x);
                const nullAngle = (Math.atan2(0, -1) * 180 / Math.PI + 360) % 360; // the -x direction is considered as angle 0

                // convert to degrees and into range of -180 to 180 degrees
                let targetAngle = (mouseAngleRads * 180 / Math.PI + 360 - nullAngle) % 360;
                if (targetAngle > 180) targetAngle -= 360;

                // the wanted angle change
                let deltaAngle = targetAngle - fgMouseFollowSprite.angle;
                if (Math.abs(deltaAngle) < 0.2) deltaAngle = 0; // minimum angle change to reduce jitter

                const constrainedAngleChange = Math.min(mousefollow.angle.turn_rate, Math.max(-mousefollow.angle.turn_rate, deltaAngle));

                const newAngle = fgMouseFollowSprite.angle + constrainedAngleChange * delta;
                fgMouseFollowSprite.angle = Math.min(mousefollow.angle.max, Math.max(mousefollow.angle.min, newAngle));
            }

            app.ticker.add(animate);

            return () => {
                app.stage.removeChild(bgBaseSprite, fgBaseSprite, fgMouseFollowSprite, fgTopSprite, bgOverlayAnim);
                fgMouseFollowSprite.off('globalpointermove', updateMousePos);
                app.ticker.remove(animate);
            }
        }
    }, [app, bgBaseSprite, bgOverlayAnim, canvasSize, fgBaseSprite, fgMouseFollowSprite, fgTopSprite, theme.main_menu.foreground_mousefollow, theme.main_menu.wave_anim]);

    useEffect(() => {
        const handleStartGame = () => {
            if (creatingLobby) return;
            
            createLobby(playerId, {
                onSuccess: (newLobby) => {
                    setLobbyId(newLobby.lobbyId);
                    setScene('lobby_queue');
                }
            });
        }

        const handleSettings = () => {
            setSettingsOpen(!settingsOpen);
        }
        
        if (app && app.stage) {
            // Create a start game button on the canvas
            const buttonStart = new PIXI.Graphics();
            buttonStart.beginFill(failedToCreateLobby?0x440000:0x000000, 0.9);
            buttonStart.drawRect(0, 0, buttonWidth, buttonHeight);
            buttonStart.endFill();
            buttonStart.x = buttonWidth/2 * (creatingLobby?1.1:1);
            buttonStart.y = firstButtonY;
            buttonStart.eventMode = 'static';
            buttonStart.on('pointerdown', handleStartGame);
            const buttonStartText = new PIXI.Text(creatingLobby?'Starting...':'Start Game', { fontSize: buttonFontSize, fill: '#ffffff' });
            buttonStartText.anchor.set(0.5);
            buttonStartText.x = buttonStart.width / 2;
            buttonStartText.y = buttonStart.height / 2;
            buttonStart.addChild(buttonStartText);

            // Create a settings button on the canvas
            const buttonSettings = new PIXI.Graphics();
            buttonSettings.beginFill(settingsOpen?0x333333:0x000000, 0.9);
            buttonSettings.drawRect(0, 0, buttonWidth, buttonHeight);
            buttonSettings.endFill();
            buttonSettings.x = buttonWidth/2 * (settingsOpen?1.1:1);
            buttonSettings.y = firstButtonY + buttonHeight*1.25;
            buttonSettings.eventMode = 'static';
            buttonSettings.on('pointerdown', handleSettings);
            const buttonSettingsText = new PIXI.Text("Settings", { fontSize: buttonFontSize, fill: '#ffffff' });
            buttonSettingsText.anchor.set(0.5);
            buttonSettingsText.x = buttonSettings.width / 2;
            buttonSettingsText.y = buttonSettings.height / 2;
            buttonSettings.addChild(buttonSettingsText);

            app.stage.addChild(buttonStart, buttonSettings);

            // Clean up on unmount
            return () => {
                app.stage.removeChild(buttonStart, buttonSettings);
                buttonStart.destroy(true);
                buttonSettings.destroy(true);
            };
        }
    }, [app, canvasSize, createLobby, creatingLobby, failedToCreateLobby, playerId, setLobbyId, setScene, settingsOpen, buttonWidth, buttonHeight, firstButtonY, buttonFontSize]);

    return (
        <>
            {settingsOpen && <SettingsMenu x={2*buttonWidth} y={canvasSize.height/2} width={canvasSize.width - 2.5*buttonWidth} height={canvasSize.height/2 * 0.8} />}
        </>
    );
}
