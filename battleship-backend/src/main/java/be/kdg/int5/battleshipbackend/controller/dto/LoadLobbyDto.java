package be.kdg.int5.battleshipbackend.controller.dto;

import be.kdg.int5.battleshipbackend.domain.Lobby;

import java.util.List;
import java.util.UUID;

public class LoadLobbyDto {
    private UUID lobbyId;
    private UUID ownerId;
    private List<UUID> players;

    private String stage;
    private boolean playerHasReadied;

    public LoadLobbyDto() {
    }

    public LoadLobbyDto(UUID lobbyId, UUID ownerId, List<UUID> players) {
        this(lobbyId, ownerId, players, "queueing", false);
    }

    public LoadLobbyDto(UUID lobbyId, UUID ownerId, List<UUID> players, String stage, boolean playerHasReadied) {
        this.lobbyId = lobbyId;
        this.ownerId = ownerId;
        this.players = players;
        this.stage = stage;
        this.playerHasReadied = playerHasReadied;
    }

    public static LoadLobbyDto from(Lobby domain) {
        return new LoadLobbyDto(
                domain.getId().uuid(),
                domain.getOwnerId().uuid(),
                domain.getPlayers()
                        .stream()
                        .map(player -> player.getId().uuid())
                        .toList()
        );
    }

    public UUID getLobbyId() {
        return lobbyId;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public List<UUID> getPlayers() {
        return players;
    }

    public String getStage() {
        return stage;
    }

    public boolean isPlayerHasReadied() {
        return playerHasReadied;
    }
}
