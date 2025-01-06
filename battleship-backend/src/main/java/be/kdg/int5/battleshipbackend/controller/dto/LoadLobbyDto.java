package be.kdg.int5.battleshipbackend.controller.dto;

import be.kdg.int5.battleshipbackend.domain.GameStage;
import be.kdg.int5.battleshipbackend.domain.Lobby;

import java.util.List;
import java.util.UUID;

public class LoadLobbyDto {
    private UUID lobbyId;
    private UUID ownerId;
    private List<LoadPlayerRecord> loadPlayerRecords;

    private String stage;
    private UUID turnOf;

    public LoadLobbyDto() {
    }

    public LoadLobbyDto(UUID lobbyId, UUID ownerId, List<LoadPlayerRecord> loadPlayerRecords, UUID turnOf) {
        this(lobbyId, ownerId, loadPlayerRecords, "queueing", turnOf);
    }

    public LoadLobbyDto(UUID lobbyId, UUID ownerId, List<LoadPlayerRecord> loadPlayerRecords, String stage, UUID turnOf) {
        this.lobbyId = lobbyId;
        this.ownerId = ownerId;
        this.loadPlayerRecords = loadPlayerRecords;
        this.stage = stage;
        this.turnOf = turnOf;
    }

    public static LoadLobbyDto from(Lobby domain) {
        return new LoadLobbyDto(
                domain.getId().uuid(),
                domain.getOwnerId().uuid(),
                domain.getPlayers()
                        .stream()
                        .map(player -> new LoadPlayerRecord(player.getId().uuid(), player.isReady()))
                        .toList(),
                domain.getGameStage().getValue(),
                domain.getGameStage() == GameStage.BATTLE ? domain.playersTurn().uuid(): null
        );
    }

    public UUID getLobbyId() {
        return lobbyId;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public List<LoadPlayerRecord> getPlayers() {
        return loadPlayerRecords;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public UUID getTurnOf() {
        return turnOf;
    }

    public void setTurnOf(UUID turnOf) {
        this.turnOf = turnOf;
    }

    public record LoadPlayerRecord(UUID playerId, boolean ready) {}
}
