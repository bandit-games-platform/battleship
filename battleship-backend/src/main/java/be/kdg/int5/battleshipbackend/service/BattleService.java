package be.kdg.int5.battleshipbackend.service;

import be.kdg.int5.battleshipbackend.domain.*;
import be.kdg.int5.battleshipbackend.repository.LobbyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BattleService {
    private static final Logger logger = LoggerFactory.getLogger(BattleService.class);

    private final LobbyRepository repository;

    public BattleService(LobbyRepository repository) {
        this.repository = repository;
    }

    public ShotResult takeShot(LobbyId lobbyId, PlayerId playerId, Coordinate shotCoordinate) {
        Lobby lobby = repository.getLobbyById(lobbyId);
        if (lobby == null) return null;
        Player player = lobby.getPlayer(playerId);
        if (player == null) return null;
        Player opponent = lobby.opponent(player);
        if (opponent == null) return null;

        if (!((lobby.getFirstToGo().equals(player.getId()) && lobby.getTurnNumber() % 2 != 0) ||
                (lobby.getFirstToGo().equals(opponent.getId()) && lobby.getTurnNumber() % 2 == 0))) {
            return null;
        }

        ShotResult shot = opponent.getBoard().checkShot(shotCoordinate);
        lobby.replacePlayer(opponent);

        if (shot.resultType() == ShotResultType.MISS) {
            lobby.addTurn();
        }

        repository.updateLobby(lobby);

        return shot;
    }

}
