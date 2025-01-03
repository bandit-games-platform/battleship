package be.kdg.int5.battleshipbackend.service;

import be.kdg.int5.battleshipbackend.domain.*;
import be.kdg.int5.battleshipbackend.repository.LobbyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArrangeShipsService {
    private final Logger logger = LoggerFactory.getLogger(ArrangeShipsService.class);

    private final LobbyRepository repository;

    public ArrangeShipsService(LobbyRepository repository) {
        this.repository = repository;
    }

    public boolean submitShipArrangement(LobbyId lobbyId, PlayerId playerId, List<Ship> arrangedShips) {
        Lobby lobby = repository.loadById(lobbyId);
        if (lobby == null) {
            logger.warn("shipArrangement: Submission for non-existent lobby: {}", lobbyId);
            return false;
        }

        Player player = lobby.getPlayerById(playerId);
        if (player == null) {
            logger.warn("shipArrangement: Submission for non-existent player: {}", playerId);
            return false;
        }

        if (player.getBoard() != null) {
            logger.error("shipArrangement: Player {} in Lobby {} already had a board set: {}",
                    playerId,
                    lobbyId,
                    player.getBoard()
            );
            return false;
        }

        try {
            Board board = new Board(arrangedShips);

            player.setBoard(board);
            repository.save(lobby);
            logger.info("shipArrangement: Ship Arrangement saved for player {} in lobby {}", playerId, lobbyId);
            return true;
        } catch (IllegalStateException e) {
            return false;
        }
    }
}
