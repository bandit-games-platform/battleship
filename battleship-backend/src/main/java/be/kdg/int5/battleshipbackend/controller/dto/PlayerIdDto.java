package be.kdg.int5.battleshipbackend.controller.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class PlayerIdDto {
    @NotNull
    private UUID playerId;

    public PlayerIdDto() {
    }

    public PlayerIdDto(UUID playerId) {
        this.playerId = playerId;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    public void setPlayerId(UUID playerId) {
        this.playerId = playerId;
    }
}
