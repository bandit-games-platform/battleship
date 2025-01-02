package be.kdg.int5.battleshipbackend.controller;

import be.kdg.int5.battleshipbackend.controller.dto.CreateLobbyDto;
import be.kdg.int5.battleshipbackend.controller.dto.JoinLobbyDto;
import be.kdg.int5.battleshipbackend.controller.dto.LoadLobbyDto;
import be.kdg.int5.battleshipbackend.domain.Lobby;
import be.kdg.int5.battleshipbackend.domain.LobbyId;
import be.kdg.int5.battleshipbackend.domain.PlayerId;
import be.kdg.int5.battleshipbackend.service.LobbyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @PostMapping("/{lobbyId}/join")
    public ResponseEntity<LoadLobbyDto> joinExistingLobby(@RequestBody @Valid JoinLobbyDto dto, @PathVariable String lobbyId) {
        UUID lobbyUUID = UUID.fromString(lobbyId);
        Lobby updatedLobby = lobbyService.joinExistingLobby(new PlayerId(dto.getPlayerId()), new LobbyId(lobbyUUID));

        return ResponseEntity.ok(LoadLobbyDto.from(updatedLobby));
    }

    @DeleteMapping("/{lobbyId}/leave")
    public ResponseEntity<Void> leaveLobby(@RequestBody @Valid JoinLobbyDto dto, @PathVariable String lobbyId) {
        UUID lobbyUUID = UUID.fromString(lobbyId);
        boolean leftLobby = lobbyService.leaveLobby(new PlayerId(dto.getPlayerId()), new LobbyId(lobbyUUID));

        if (leftLobby) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
