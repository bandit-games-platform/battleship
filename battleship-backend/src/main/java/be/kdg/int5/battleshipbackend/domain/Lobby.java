package be.kdg.int5.battleshipbackend.domain;

import java.util.List;
import java.util.stream.Collectors;

public class Lobby {
    private final LobbyId id;
    private PlayerId ownerId;
    private List<Player> players;

    public Lobby(LobbyId id, PlayerId ownerId, List<PlayerId> players) {
        this.id = id;
        this.ownerId = ownerId;
        this.players = players.stream().map(Player::new).collect(Collectors.toList());
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

    public Player getPlayer(PlayerId player) {
        return this.players.stream().filter(p -> p.getId().equals(player)).findFirst().orElse(null);
    }

    public void replacePlayer(Player player) {
        for (int i = 0; i < players.size(); i++) {
            if (players.get(i).getId().equals(player.getId())) {
                players.set(i, player);
                break;
            }
        }
    }

    public void addPlayer(PlayerId player) {
        this.players.add(new Player(player));
    }

    public boolean removePlayer(PlayerId player) {
        for (Player lobbyPlayer: this.players) {
            if (lobbyPlayer.getId().equals(player)) {
                players.remove(lobbyPlayer);
                return true;
            }
        }
        return false;
    }
}
