package be.kdg.int5.battleshipbackend.repository;

import be.kdg.int5.battleshipbackend.domain.Lobby;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Repository
public class LobbyRepositoryImpl implements LobbyRepository {
    private final Map<UUID, Lobby> lobbyMap = new HashMap<>();

    @Override
    public Lobby save(Lobby lobby) {
        lobbyMap.put(lobby.getId().uuid(), lobby);

        return lobby;
    }
}
