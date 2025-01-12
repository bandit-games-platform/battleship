package be.kdg.int5.battleshipbackend.controller;

import be.kdg.int5.battleshipbackend.controller.dto.MatchStatisticsDto;
import be.kdg.int5.battleshipbackend.controller.dto.MatchStatisticsDto.*;
import be.kdg.int5.battleshipbackend.controller.dto.PlayerIdDto;
import be.kdg.int5.battleshipbackend.domain.*;
import be.kdg.int5.battleshipbackend.service.LobbyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/lobby")
public class GameEndController {
    private final LobbyService lobbyService;

    public GameEndController(LobbyService lobbyService) {
        this.lobbyService = lobbyService;
    }

    @GetMapping("/{lobbyId}/end-stats")
    public ResponseEntity<MatchStatisticsDto> getLobbyMatchStatistics(@PathVariable String lobbyId) {
        UUID lobbyUUID = UUID.fromString(lobbyId);
        Lobby lobby = lobbyService.getLobbyInformation(new LobbyId(lobbyUUID));

        if (lobby.getGameStage() != GameStage.FINISHED) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        MatchStatisticsDto matchStatisticsDto = new MatchStatisticsDto();

        for (Player player: lobby.getPlayers()) {
            if (!player.hasLostBattle()) matchStatisticsDto.setWinningPlayer(player.getId().uuid());
            matchStatisticsDto.addPlayer(convertToDtoValue(player));
        }

        if (matchStatisticsDto.getWinningPlayer() == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return ResponseEntity.ok(matchStatisticsDto);
    }

    @PostMapping("/{lobbyId}/restart")
    public ResponseEntity<Void> voteToRestartLobby(@PathVariable String lobbyId, @Valid @RequestBody PlayerIdDto dto) {
        UUID lobbyUUID = UUID.fromString(lobbyId);
        lobbyService.voteToRestart(new LobbyId(lobbyUUID), new PlayerId(dto.getPlayerId()));

        return ResponseEntity.ok().build();
    }

    private PlayerEndDto convertToDtoValue(Player player) {
        List<EndPlayerShipDto> aliveShips = shipListToShipDtoList(player.getBoard().getAliveShips());

        List<EndPlayerShipDto> sunkShips = shipListToShipDtoList(player.getBoard().getSunkShips());

        Set<Coordinate> allShipCoordinates = allShipCoordinates(player);

        List<EndShotCoordinateDto> shotsOnShips = player.getBoard().getShots().stream().map(
                shot -> new EndShotCoordinateDto(shot.row(), shot.col(), !allShipCoordinates.contains(shot))
        ).collect(Collectors.toList());

        return new PlayerEndDto(
                player.getId().uuid(),
                aliveShips,
                sunkShips,
                shotsOnShips
        );
    }

    private Set<Coordinate> allShipCoordinates(Player player) {
        Set<Coordinate> allShipCoordinates = new HashSet<>();
        for (Ship ship: player.getBoard().getAliveShips()) {
            allShipCoordinates.addAll(ship.getCoordinates());
        }
        for (Ship ship: player.getBoard().getSunkShips()) {
            allShipCoordinates.addAll(ship.getCoordinates());
        }
        return allShipCoordinates;
    }

    private List<EndPlayerShipDto> shipListToShipDtoList(List<Ship> ships) {
        return ships.stream().map(
                ship -> new EndPlayerShipDto(
                        ship.getType().name(),
                        new EndCoordinateDto(ship.getPlacement().row(), ship.getPlacement().col()),
                        ship.isVertical(),
                        ship.getHitCount() >= ship.getType().getLength(),
                        ship.getCoordinates().stream().map(
                                coordinate -> new EndCoordinateDto(coordinate.row(), coordinate.col())
                        ).collect(Collectors.toList())
                )
        ).collect(Collectors.toList());
    }
}
