package be.kdg.int5.battleshipbackend.repository;

import be.kdg.int5.battleshipbackend.domain.Lobby;

public interface LobbyRepository {
    Lobby save(Lobby lobby);
}
