package be.kdg.int5.battleshipbackend.controller.dto;

import java.util.UUID;

public class MatchStatisticsDto {
    private UUID winningPlayer;

    public MatchStatisticsDto() {
    }

    public MatchStatisticsDto(UUID winningPlayer) {
        this.winningPlayer = winningPlayer;
    }

    public UUID getWinningPlayer() {
        return winningPlayer;
    }

    public void setWinningPlayer(UUID winningPlayer) {
        this.winningPlayer = winningPlayer;
    }
}
