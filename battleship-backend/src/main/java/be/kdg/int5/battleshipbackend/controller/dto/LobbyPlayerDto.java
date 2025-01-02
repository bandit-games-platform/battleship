package be.kdg.int5.battleshipbackend.controller.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class LobbyPlayerDto {
    @NotNull
    private UUID playerId;

    public LobbyPlayerDto() {
    }

    public LobbyPlayerDto(UUID playerId) {
        this.playerId = playerId;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    public void setPlayerId(UUID playerId) {
        this.playerId = playerId;
    }
}
