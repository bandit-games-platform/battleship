package be.kdg.int5.battleshipbackend.controller;

import be.kdg.int5.battleshipbackend.controller.dto.IdentityDto;
import be.kdg.int5.battleshipbackend.controller.dto.PlayerShotsShipsDto;
import be.kdg.int5.battleshipbackend.controller.dto.PlayerShotsShipsDto.*;
import be.kdg.int5.battleshipbackend.domain.*;
import be.kdg.int5.battleshipbackend.service.LobbyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/battle")
public class BattleController {
    private final LobbyService lobbyService;

    public BattleController(LobbyService lobbyService) {
        this.lobbyService = lobbyService;
    }

    @GetMapping("/status")
    public ResponseEntity<PlayerShotsShipsDto> getBattlefieldStatusForPlayer(
            @RequestParam UUID playerId,
            @RequestParam UUID lobbyId
            ) {
        Lobby lobby = lobbyService.getLobbyInformation(new LobbyId(lobbyId));
        if (lobby == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        Player player = lobby.getPlayer(new PlayerId(playerId));
        if (player == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        Player opponent = lobby.opponent(player);
        if (opponent == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        List<PlayerShipDto> ourAliveShips = shipListToShipDtoList(player.getBoard().getAliveShips());

        List<PlayerShipDto> ourSunkShips = shipListToShipDtoList(player.getBoard().getSunkShips());

        List<CoordinateDto> shotsOnOurShips = opponent.getBoard().getShots().stream().map(
                shot -> new CoordinateDto(shot.row(), shot.col())
        ).collect(Collectors.toList());

        List<PlayerShipDto> opponentSunkShips = shipListToShipDtoList(opponent.getBoard().getSunkShips());

        List<CoordinateDto> shotsWeTook = player.getBoard().getShots().stream().map(
                shot -> new CoordinateDto(shot.row(), shot.col())
        ).collect(Collectors.toList());

        PlayerShotsShipsDto playerShotsShipsDto = new PlayerShotsShipsDto(
                lobby.getId().uuid(),
                player.getId().uuid(),
                ourAliveShips,
                ourSunkShips,
                shotsOnOurShips,
                opponent.getBoard().getAliveShips().size(),
                opponentSunkShips,
                shotsWeTook
        );

        return ResponseEntity.ok(playerShotsShipsDto);
    }

    private List<PlayerShipDto> shipListToShipDtoList(List<Ship> ships) {
        return ships.stream().map(
                ship -> new PlayerShipDto(
                        ship.getType().name(),
                        new CoordinateDto(ship.getPlacement().row(), ship.getPlacement().col()),
                        ship.isVertical(),
                        ship.getCoordinates().stream().map(
                                coordinate -> new CoordinateDto(coordinate.row(), coordinate.col())
                        ).collect(Collectors.toList())
                )
        ).collect(Collectors.toList());
    }
}
