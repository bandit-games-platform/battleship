package be.kdg.int5.battleshipbackend.service;

import be.kdg.int5.GameSDK;
import be.kdg.int5.battleshipbackend.domain.*;
import be.kdg.int5.battleshipbackend.repository.LobbyRepository;
import be.kdg.int5.domain.EndState;
import be.kdg.int5.domain.GameContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BattleService {
    private static final Logger logger = LoggerFactory.getLogger(BattleService.class);

    private final LobbyRepository repository;
    private final GameSDK sdk;
    private final GameContext ctx;

    public BattleService(LobbyRepository repository, GameSDK sdk, GameContext ctx) {
        this.repository = repository;
        this.sdk = sdk;
        this.ctx = ctx;
    }

    public ShotResult takeShot(LobbyId lobbyId, PlayerId playerId, Coordinate shotCoordinate) {
        Lobby lobby = repository.getLobbyById(lobbyId);
        if (lobby == null) return null;
        Player player = lobby.getPlayer(playerId);
        if (player == null) return null;
        Player opponent = lobby.opponent(player);
        if (opponent == null) return null;

        if (lobby.playersTurn() != player.getId()) {
            return null;
        }

        ShotResult shot = opponent.getBoard().checkShot(shotCoordinate);

        if (shot.resultType() == ShotResultType.MISS) {
            lobby.addTurn();
        }

        if (shot.resultType() == ShotResultType.SUNK) {
            sdk.updateAchievementProgress(ctx, playerId.uuid(), 210, null);
            sdk.updateAchievementProgress(ctx, playerId.uuid(), 225, null);
            sdk.updateAchievementProgress(ctx, playerId.uuid(), 250, null);
            sdk.updateAchievementProgress(ctx, playerId.uuid(), 275, null);
            sdk.updateAchievementProgress(ctx, playerId.uuid(), 200, null);
        }

        if (lobby.getGameStage() == GameStage.FINISHED) {
            submitFinishedStatistics(lobby);
        }

        repository.updateLobby(lobby);

        return shot;
    }

    private void submitFinishedStatistics(Lobby lobby) {
        logger.info("Game in lobby {} has ended, submitting statistics now", lobby.getId().uuid());
        for (Player player: lobby.getPlayers()) {
            Player opponent = lobby.opponent(player);
            UUID playerId = player.getId().uuid();

            sdk.submitCompletedSession(
                    ctx,
                    playerId,
                    lobby.getBattleStartTime(),
                    LocalDateTime.now(),
                    player.hasLostBattle() ? EndState.LOSS : EndState.WIN,
                    opponent.getBoard().getShots().size(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    lobby.getFirstToGo().equals(player.getId())
            );

            // Checking if they earned any achievements/progress and submitting them
            if (!player.hasLostBattle()) {
                if (player.getBoard().getSunkShips().isEmpty()) {
                    sdk.updateAchievementProgress(ctx, playerId, 999, null);
                }

                sdk.updateAchievementProgress(ctx, playerId, 101, null);
                sdk.updateAchievementProgress(ctx, playerId, 105, null);
                sdk.updateAchievementProgress(ctx, playerId, 110, null);
                sdk.updateAchievementProgress(ctx, playerId, 125, null);
                sdk.updateAchievementProgress(ctx, playerId, 150, null);
            }
        }
    }

}
