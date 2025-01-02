package be.kdg.int5.battleshipbackend.repository;

import be.kdg.int5.battleshipbackend.domain.Lobby;
import be.kdg.int5.battleshipbackend.domain.LobbyId;
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

    @Override
    public Lobby getLobby(LobbyId lobbyId) {
        return lobbyMap.get(lobbyId.uuid());
    }

    @Override
    public void updatedLobby(Lobby lobby) {
        lobbyMap.replace(lobby.getId().uuid(), lobby);
    }

    @Override
    public void removeLobby(LobbyId lobbyId) {
        lobbyMap.remove(lobbyId.uuid());
    }
}
