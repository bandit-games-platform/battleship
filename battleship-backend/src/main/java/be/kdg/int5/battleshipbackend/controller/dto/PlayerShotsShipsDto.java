package be.kdg.int5.battleshipbackend.controller.dto;

import java.util.List;
import java.util.UUID;

public class PlayerShotsShipsDto {
    private IdentityDto identity;
    private List<PlayerShipDto> ourAliveShips;
    private List<PlayerShipDto> ourSunkShips;
    private List<ShotCoordinateDto> shotsOnOurShips;

    private int opponentAliveShips;
    private List<PlayerShipDto> sunkOpponentsShips;
    private List<ShotCoordinateDto> shotsOnOpponentShips;

    public PlayerShotsShipsDto(
            IdentityDto identity,
            List<PlayerShipDto> ourAliveShips,
            List<PlayerShipDto> ourSunkShips,
            List<ShotCoordinateDto> shotsOnOurShips,
            int opponentAliveShips,
            List<PlayerShipDto> sunkOpponentsShips,
            List<ShotCoordinateDto> shotsOnOpponentShips
    ) {
        this.identity = identity;
        this.ourAliveShips = ourAliveShips;
        this.ourSunkShips = ourSunkShips;
        this.shotsOnOurShips = shotsOnOurShips;
        this.opponentAliveShips = opponentAliveShips;
        this.sunkOpponentsShips = sunkOpponentsShips;
        this.shotsOnOpponentShips = shotsOnOpponentShips;
    }

    public IdentityDto getIdentity() {
        return identity;
    }

    public void setIdentity(IdentityDto identity) {
        this.identity = identity;
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

    public List<ShotCoordinateDto> getShotsOnOurShips() {
        return shotsOnOurShips;
    }

    public void setShotsOnOurShips(List<ShotCoordinateDto> shotsOnOurShips) {
        this.shotsOnOurShips = shotsOnOurShips;
    }

    public int getOpponentAliveShips() {
        return opponentAliveShips;
    }

    public void setOpponentAliveShips(int opponentAliveShips) {
        this.opponentAliveShips = opponentAliveShips;
    }

    public List<PlayerShipDto> getSunkOpponentsShips() {
        return sunkOpponentsShips;
    }

    public void setSunkOpponentsShips(List<PlayerShipDto> sunkOpponentsShips) {
        this.sunkOpponentsShips = sunkOpponentsShips;
    }

    public List<ShotCoordinateDto> getShotsOnOpponentShips() {
        return shotsOnOpponentShips;
    }

    public void setShotsOnOpponentShips(List<ShotCoordinateDto> shotsOnOpponentShips) {
        this.shotsOnOpponentShips = shotsOnOpponentShips;
    }


    public record PlayerShipDto (
            String shipType,
            CoordinateDto placementCoordinate,
            boolean isVertical,
            boolean sunk,
            List<CoordinateDto> shipCoordinates
    ) {}

    public record CoordinateDto (int row, int col) {}
    public record ShotCoordinateDto(int row, int col, boolean miss) {}
}
