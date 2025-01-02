package be.kdg.int5.battleshipbackend.repository;

import be.kdg.int5.battleshipbackend.domain.Lobby;
import be.kdg.int5.battleshipbackend.domain.LobbyId;

public interface LobbyRepository {
    Lobby save(Lobby lobby);
    Lobby getLobby(LobbyId lobbyId);
    void updatedLobby(Lobby lobby);
    void removeLobby(LobbyId lobbyId);
}
