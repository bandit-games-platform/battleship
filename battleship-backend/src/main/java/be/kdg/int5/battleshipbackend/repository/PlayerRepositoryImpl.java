package be.kdg.int5.battleshipbackend.repository;

import be.kdg.int5.battleshipbackend.domain.Player;
import be.kdg.int5.battleshipbackend.domain.PlayerId;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Repository
public class PlayerRepositoryImpl implements PlayerRepository {
    private final Map<UUID, Player> playerMap = new HashMap<>();

    @Override
    public Player save(Player player) {
        playerMap.put(player.getId().uuid(), player);

        return player;
    }

    @Override
    public Player loadById(PlayerId playerId) {
        return playerMap.get(playerId.uuid());
    }
}
