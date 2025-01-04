package be.kdg.int5.battleshipbackend.controller.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class IdentityDto {
    @NotNull
    private UUID lobbyId;
    @NotNull
    private UUID playerId;

    public IdentityDto() {
    }

    public IdentityDto(UUID lobbyId, UUID playerId) {
        this.lobbyId = lobbyId;
        this.playerId = playerId;
    }

    public @NotNull UUID getLobbyId() {
        return lobbyId;
    }

    public @NotNull UUID getPlayerId() {
        return playerId;
    }
}
