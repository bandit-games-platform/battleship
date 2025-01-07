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
        }
    },
]
