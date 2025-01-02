/*
 When developing new features:
 Add anything that you wish to be changeable by the selected theme to the BattleshipTheme interface,
 then go to themes.ts and add a default example / placeholder asset/value to our default (Concept Art) theme.

 If you find yourself repeating the same structure more than 2 times:
 Consider extracting it into a separate interface (like I did for AnimSpriteSheet).

 Additional Notes:
 - meta is for any metadata about the theme
 */

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

    effects: {
        explosion_anim: AnimSpriteSheet
    },
}
