package be.kdg.int5.battleshipbackend.repository;

import be.kdg.int5.battleshipbackend.domain.Player;
import be.kdg.int5.battleshipbackend.domain.PlayerId;

public interface PlayerRepository {
    Player save(Player player);

    Player loadById(PlayerId playerId);
}
