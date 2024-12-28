package be.kdg.int5.battleshipbackend.controller.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateLobbyDto {
    @NotNull
    private UUID ownerId;

    public CreateLobbyDto() {
    }

    public CreateLobbyDto(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public UUID getOwnerId() {
        return ownerId;
    }
}
