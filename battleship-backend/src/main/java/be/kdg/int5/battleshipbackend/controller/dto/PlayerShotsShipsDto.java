package be.kdg.int5.battleshipbackend.controller.dto;

import java.util.List;
import java.util.UUID;

public class PlayerShotsShipsDto {
    private UUID lobbyId;
    private UUID playerId;
    private List<PlayerShipDto> ourAliveShips;
    private List<PlayerShipDto> ourSunkShips;
    private List<CoordinateDto> shotsOnOurShips;

    private int opponentAliveShips;
    private List<PlayerShipDto> sunkOpponentsShip;
    private List<CoordinateDto> shotsOnOpponentShips;

    public PlayerShotsShipsDto(
            UUID lobbyId,
            UUID playerId,
            List<PlayerShipDto> ourAliveShips,
            List<PlayerShipDto> ourSunkShips,
            List<CoordinateDto> shotsOnOurShips,
            int opponentAliveShips,
            List<PlayerShipDto> sunkOpponentsShip,
            List<CoordinateDto> shotsOnOpponentShips
    ) {
        this.lobbyId = lobbyId;
        this.playerId = playerId;
        this.ourAliveShips = ourAliveShips;
        this.ourSunkShips = ourSunkShips;
        this.shotsOnOurShips = shotsOnOurShips;
        this.opponentAliveShips = opponentAliveShips;
        this.sunkOpponentsShip = sunkOpponentsShip;
        this.shotsOnOpponentShips = shotsOnOpponentShips;
    }

    public UUID getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(UUID lobbyId) {
        this.lobbyId = lobbyId;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    public void setPlayerId(UUID playerId) {
        this.playerId = playerId;
    }

    public List<PlayerShipDto> getOurAliveShips() {
        return ourAliveShips;
    }

    public void setOurAliveShips(List<PlayerShipDto> ourAliveShips) {
        this.ourAliveShips = ourAliveShips;
    }

    public List<PlayerShipDto> getOurSunkShips() {
        return ourSunkShips;
    }

    public void setOurSunkShips(List<PlayerShipDto> ourSunkShips) {
        this.ourSunkShips = ourSunkShips;
    }

    public List<CoordinateDto> getShotsOnOurShips() {
        return shotsOnOurShips;
    }

    public void setShotsOnOurShips(List<CoordinateDto> shotsOnOurShips) {
        this.shotsOnOurShips = shotsOnOurShips;
    }

    public int getOpponentAliveShips() {
        return opponentAliveShips;
    }

    public void setOpponentAliveShips(int opponentAliveShips) {
        this.opponentAliveShips = opponentAliveShips;
    }

    public List<PlayerShipDto> getSunkOpponentsShip() {
        return sunkOpponentsShip;
    }

    public void setSunkOpponentsShip(List<PlayerShipDto> sunkOpponentsShip) {
        this.sunkOpponentsShip = sunkOpponentsShip;
    }

    public List<CoordinateDto> getShotsOnOpponentShips() {
        return shotsOnOpponentShips;
    }

    public void setShotsOnOpponentShips(List<CoordinateDto> shotsOnOpponentShips) {
        this.shotsOnOpponentShips = shotsOnOpponentShips;
    }


    public record PlayerShipDto (
            String shipType,
            CoordinateDto placementCoordinate,
            boolean isVertical,
            List<CoordinateDto> shipCoordinate
    ) {}

    public record CoordinateDto (int row, int col) {}
}
