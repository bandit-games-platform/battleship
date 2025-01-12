package be.kdg.int5.battleshipbackend.controller.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class MatchStatisticsDto {
    private UUID winningPlayer;

    public List<PlayerEndDto> players;

    public MatchStatisticsDto() {
        players = new ArrayList<>();
    }

    public MatchStatisticsDto(UUID winningPlayer) {
        this.winningPlayer = winningPlayer;
        players = new ArrayList<>();
    }

    public UUID getWinningPlayer() {
        return winningPlayer;
    }

    public void setWinningPlayer(UUID winningPlayer) {
        this.winningPlayer = winningPlayer;
    }

    public List<PlayerEndDto> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerEndDto> players) {
        this.players = players;
    }

    public void addPlayer(PlayerEndDto player) {
        players.add(player);
    }

    public record PlayerEndDto (
        UUID playerId,
        List<EndPlayerShipDto> aliveShips,
        List<EndPlayerShipDto> sunkShips,
        List<EndShotCoordinateDto> shotsOnBoard
    ) {}

    public record EndPlayerShipDto(
            String shipType,
            EndCoordinateDto placementCoordinate,
            boolean isVertical,
            boolean sunk,
            List<EndCoordinateDto> shipCoordinates
    ) {}

    public record EndCoordinateDto(int row, int col) {}
    public record EndShotCoordinateDto(int row, int col, boolean miss) {}
}
