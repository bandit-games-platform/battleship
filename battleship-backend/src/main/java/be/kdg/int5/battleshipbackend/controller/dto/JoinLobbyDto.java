package be.kdg.int5.battleshipbackend.controller.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class JoinLobbyDto {
    @NotNull
    private UUID playerId;

    public JoinLobbyDto() {
    }

    public JoinLobbyDto(UUID playerId) {
        this.playerId = playerId;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    public void setPlayerId(UUID playerId) {
        this.playerId = playerId;
    }
}
