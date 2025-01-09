package be.kdg.int5.battleshipbackend.controller;

import be.kdg.int5.battleshipbackend.controller.dto.MatchStatisticsDto;
import be.kdg.int5.battleshipbackend.controller.dto.PlayerIdDto;
import be.kdg.int5.battleshipbackend.domain.*;
import be.kdg.int5.battleshipbackend.service.LobbyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

        for (Player player: lobby.getPlayers()) {
            if (!player.hasLostBattle()) return ResponseEntity.ok(new MatchStatisticsDto(player.getId().uuid()));
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/{lobbyId}/restart")
    public ResponseEntity<Void> voteToRestartLobby(@PathVariable String lobbyId, @Valid @RequestBody PlayerIdDto dto) {
        UUID lobbyUUID = UUID.fromString(lobbyId);
        lobbyService.voteToRestart(new LobbyId(lobbyUUID), new PlayerId(dto.getPlayerId()));

        return ResponseEntity.ok().build();
    }
}
