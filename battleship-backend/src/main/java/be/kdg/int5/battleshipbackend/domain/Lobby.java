package be.kdg.int5.battleshipbackend.domain;

import java.util.List;

public class Lobby {
    private final LobbyId id;
    private PlayerId ownerId;
    private List<PlayerId> players;

    public Lobby(LobbyId id, PlayerId ownerId, List<PlayerId> players) {
        this.id = id;
        this.ownerId = ownerId;
        this.players = players;
    }

    public PlayerId opponent(PlayerId player) {
        return players.stream().filter(pid -> !pid.uuid().equals(player.uuid())).findAny().orElseThrow();
    }

    public LobbyId getId() {
        return id;
    }

    public PlayerId getOwnerId() {
        return ownerId;
    }

    public List<PlayerId> getPlayers() {
        return players;
    }

    public void setOwnerId(PlayerId ownerId) {
        this.ownerId = ownerId;
    }

    public void setPlayers(List<PlayerId> players) {
        this.players = players;
    }

    public void addPlayer(PlayerId player) {
        this.players.add(player);
    }
}
