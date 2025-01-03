package be.kdg.int5.battleshipbackend.repository;

import be.kdg.int5.battleshipbackend.domain.Lobby;
import be.kdg.int5.battleshipbackend.domain.LobbyId;

public interface LobbyRepository {
    Lobby save(Lobby lobby);
    Lobby getLobbyById(LobbyId lobbyId);
    void updatedLobby(Lobby lobby);
    void removeLobbyById(LobbyId lobbyId);
}
