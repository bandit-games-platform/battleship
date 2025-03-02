package be.kdg.int5.battleshipbackend.service;

import be.kdg.int5.battleshipbackend.domain.*;
import be.kdg.int5.battleshipbackend.repository.LobbyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

        Player player = lobby.getPlayer(playerId);
        if (player == null) {
            logger.warn("shipArrangement: Submission for non-existent player: {}", playerId);
            return false;
        }

        if (lobby.getGameStage() != GameStage.ARRANGING) {
            logger.warn("shipArrangement: Submission denied for lobby {} in bad state: {} by player: {}",
                    lobbyId,
                    lobby.getGameStage(),
                    playerId
            );
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

            if (lobby.getGameStage() == GameStage.BATTLE) {
                lobby.setBattleStartTime(LocalDateTime.now());
            }

            repository.save(lobby);
            logger.info("shipArrangement: Ship Arrangement saved for player {} in lobby {}", playerId, lobbyId);
            return true;
        } catch (IllegalStateException e) {
            logger.warn("shipArrangement: Board was not accepted for player {} in lobby {}", playerId, lobbyId);
            return false;
        }
    }
}
