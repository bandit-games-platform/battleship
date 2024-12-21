package be.kdg.int5.battleshipbackend.config;

import be.kdg.int5.domain.Achievement;

public enum Achievements {
    GAMES_WON_1(101, "Ensign", "Win your first battle", 1),
    GAMES_WON_5(105, "Lieutenant", "Win 5 battles", 5),
    GAMES_WON_10(110, "Commander", "Win 10 battles", 10),
    GAMES_WON_25(125, "Captain", "Win 25 battles", 25),
    GAMES_WON_50(150, "Admiral", "Win 50 battles", 50),

    SHIPS_SUNK_10(210, "Upstart Adversary", "Sink 10 enemy ships", 10),
    SHIPS_SUNK_25(225, "Feared Foe", "Sink 25 enemy ships", 25),
    SHIPS_SUNK_50(250, "Terrifying Tyrant", "Sink 50 enemy ships", 50),
    SHIPS_SUNK_75(275, "Dreaded Dominator", "Sink 75 enemy ships", 75),
    SHIPS_SUNK_100(200, "Cold-Blooded Conqueror", "Sink 100 enemy ships", 100),

    SHOT_ALL_PARTS_OF_ENEMY_CARRIER_EXCEPT_END(988, "Heads or Tails?", "Shoot every section of an enemy carrier other than the last section on either end."),
    WON_WITHOUT_ANY_SUNK_SHIPS(999, "Target Practice", "Win a battle without losing any of your ships.");


    public final int ref;
    private final String title;
    private final String description;
    private final Integer counterTotal;

    Achievements(int ref, String title, String description) {
        this.ref = ref;
        this.title = title;
        this.description = description;
        this.counterTotal = null;
    }

    Achievements(int ref, String title, String description, int counterTotal) {
        this.ref = ref;
        this.title = title;
        this.description = description;
        this.counterTotal = counterTotal;
    }

    public Achievement toSDK() {
        if (counterTotal == null) {
            return new Achievement(ref, title, description);
        } else {
            return new Achievement(ref, title, description, counterTotal);
        }
    }
}
