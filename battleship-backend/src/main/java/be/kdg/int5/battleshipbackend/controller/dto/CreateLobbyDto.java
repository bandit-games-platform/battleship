package be.kdg.int5.battleshipbackend.controller.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateLobbyDto {
    @NotNull
    private UUID ownerId;
    @NotNull
    private int themeIndex;

    public CreateLobbyDto() {
    }

    public CreateLobbyDto(UUID ownerId, int themeIndex) {
        this.ownerId = ownerId;
        this.themeIndex = themeIndex;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public int getThemeIndex() {
        return themeIndex;
    }
}
