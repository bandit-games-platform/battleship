package be.kdg.int5.battleshipbackend.controller;

import be.kdg.int5.battleshipbackend.controller.dto.CreateLobbyDto;
import be.kdg.int5.battleshipbackend.controller.dto.LoadLobbyDto;
import be.kdg.int5.battleshipbackend.domain.Lobby;
import be.kdg.int5.battleshipbackend.domain.PlayerId;
import be.kdg.int5.battleshipbackend.service.LobbyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lobby")
public class LobbyController {
    private final LobbyService lobbyService;

    public LobbyController(LobbyService lobbyService) {
        this.lobbyService = lobbyService;
    }

    @PostMapping
    public ResponseEntity<LoadLobbyDto> startNewLobby(@RequestBody @Valid CreateLobbyDto createLobbyDto) {
        Lobby newLobby = lobbyService.startNewLobby(new PlayerId(createLobbyDto.getOwnerId()));

        if (newLobby == null) return new ResponseEntity<>(HttpStatus.CONFLICT);

        return ResponseEntity.ok(LoadLobbyDto.from(newLobby));
    }
}
