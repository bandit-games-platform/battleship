package be.kdg.int5.battleshipbackend.domain;

public enum GameStage {
    QUEUEING("queueing"),
    ARRANGING("arranging"),
    PLAYING("playing");

    private final String value;
    GameStage(String value) {
        this.value = value;
    }
    public String getValue() {
        return value;
    }
}
