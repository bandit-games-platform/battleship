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
            rows: 2
        },
        effects: {
            explosion_anim: {
                src: assets + "concept/effects/explosion.png",
                cols: 5,
                rows: 2,
                speed: 0.25
            }
        }
    },
]
