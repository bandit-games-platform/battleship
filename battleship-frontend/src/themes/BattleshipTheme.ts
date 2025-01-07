/*
 When developing new features:
 Add anything that you wish to be changeable by the selected theme to the BattleshipTheme interface,
 then go to themes.ts and add a default example / placeholder asset/value to our default (Concept Art) theme.

 If you find yourself repeating the same structure more than 2 times:
 Consider extracting it into a separate interface (like I did for AnimSpriteSheet).

 Additional Notes:
 - meta is for any metadata about the theme
 */

import {ShipType} from "../model/ShipType.ts";

export interface AnimSpriteSheet {
    src: string,
    cols: number,
    rows: number,
    unused?: number,
    speed?: number
}

export interface BattleshipTheme {
    meta: {
        name: string,
    },

    board_background_anim: AnimSpriteSheet,
    board_grid: { line_width: number, line_color: number, line_alpha: number },

    ships: { [key in ShipType]: string},

    markers: {MISS: string, HIT: string},

    effects: {
        explosion_anim: AnimSpriteSheet,
        splash_anim: AnimSpriteSheet,
    },

    sounds: {
        hit: string,
        miss: string,
        battle_music: string,
        victory_sound: string,
        defeat_sound: string,
    },

    music_icons: {unmuted: string, muted: string}
}
