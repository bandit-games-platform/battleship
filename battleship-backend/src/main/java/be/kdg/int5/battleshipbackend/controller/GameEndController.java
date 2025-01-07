package be.kdg.int5.battleshipbackend.controller;

import be.kdg.int5.battleshipbackend.controller.dto.MatchStatisticsDto;
import be.kdg.int5.battleshipbackend.domain.Lobby;
import be.kdg.int5.battleshipbackend.domain.LobbyId;
import be.kdg.int5.battleshipbackend.service.LobbyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }
}
