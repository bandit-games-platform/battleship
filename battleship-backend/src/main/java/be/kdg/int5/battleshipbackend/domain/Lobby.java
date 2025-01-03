package be.kdg.int5.battleshipbackend.domain;

import java.util.List;

public class Lobby {
    private final LobbyId id;
    private PlayerId ownerId;
    private List<Player> players;

    public Lobby(LobbyId id, PlayerId ownerId, List<PlayerId> players) {
        this.id = id;
        this.ownerId = ownerId;
        this.players = players.stream().map(Player::new).toList();
    }

    public Player getPlayerById(PlayerId playerId) {
        return players
                .stream()
                .filter(player -> playerId.equals(player.getId()))
                .findAny()
                .orElse(null);
    }

    public Player opponent(Player player) {
        return players
                .stream()
                .filter(p -> !player.getId().equals(p.getId()))
                .findAny()
                .orElseThrow();
    }

    public LobbyId getId() {
        return id;
    }

    public PlayerId getOwnerId() {
        return ownerId;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setOwnerId(PlayerId ownerId) {
        this.ownerId = ownerId;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public void addPlayer(PlayerId player) {
        this.players.add(new Player(player));
    }
}
