package be.kdg.int5.battleshipbackend.repository;

import be.kdg.int5.battleshipbackend.domain.Lobby;
import be.kdg.int5.battleshipbackend.domain.LobbyId;

public interface LobbyRepository {
    Lobby save(Lobby lobby);

    Lobby loadById(LobbyId lobbyId);
    Lobby getLobbyById(LobbyId lobbyId);
    void updateLobby(Lobby lobby);
    void removeLobbyById(LobbyId lobbyId);
}
