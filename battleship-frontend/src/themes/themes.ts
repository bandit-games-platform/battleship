import {BattleshipTheme} from "./BattleshipTheme.ts";

const assets = "../assets/";

export const themes: BattleshipTheme[] = [
    {
        meta: {
            name: "Concept Art",
        },
        board_background_anim: {
            src: assets + "concept/water_animated.png",
            cols: 4,
            rows: 2,
            speed: 0.1
        },
        board_grid: {line_width: 3, line_color: 0xdddddd, line_alpha: 0.3},
        ships: {
            CARRIER: assets + "concept/carrier.png",
            BATTLESHIP: assets + "concept/battleship.png",
            CRUISER: assets + "concept/cruiser.png",
            SUBMARINE: assets + "concept/submarine.png",
            DESTROYER: assets + "concept/destroyer.png",
        },
        markers: {
            miss: assets + "concept/ship_miss_marker.png",
            hit: assets + "concept/ship_hit_marker.png",
        },
        main_menu: {
            background_static_base: assets + "concept/sunset_background.png",
            foreground_static_base: assets + "concept/sunset_ship.png",
            foreground_mousefollow: {
                static_asset: assets + "concept/sunset_turretgun.png",
                pos: {x: 1125, y: 715},
                angle: {
                    min: -5,
                    max: 55,
                    turn_rate: 0.5
                }
            },
            foreground_static_top: assets + "concept/sunset_turretcover.png",
            wave_anim: {
                wave_function: t => 0.6 * Math.sin(0.03*t) + 0.3 * Math.sin(0.04*t) + 0.1 * Math.sin(-0.13*t),
                offset_amplitude: {
                    background: 0.025,
                    foreground: 0.0125
                }
            },
        },
        effects: {
            explosion_anim: {
                src: assets + "concept/effects/explosion.png",
                cols: 5,
                rows: 2,
                speed: 0.25
            },
            splash_anim: {
                src: assets + "concept/effects/splash.png",
                cols: 7,
                rows: 1,
                speed: 0.25
            }
        },
        sounds : {
            hit: assets + "sounds/hit_explosion.mp3",
            miss: assets + "sounds/miss_splash.mp3",
            battle_music: assets + "sounds/battle_music.mp3",
            victory_sound: assets + "sounds/victory_sound.mp3",
            defeat_sound: assets + "sounds/defeat_sound.mp3"
        },
        music_icons: {
            unmuted: assets + "unmuted_icon.png",
            muted: assets + "muted_icon.png"
        }
    },
]
