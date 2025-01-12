package be.kdg.int5.battleshipbackend.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class Lobby {
    private final LobbyId id;
    private PlayerId ownerId;
    private int themeIndex;
    private List<Player> players;
    private PlayerId firstToGo;
    private int turnNumber;
    private LocalDateTime battleStartTime = null;

    public Lobby(LobbyId id, PlayerId ownerId, int themeIndex, List<PlayerId> players) {
        this.id = id;
        this.ownerId = ownerId;
        this.themeIndex = themeIndex;
        this.players = players.stream().map(Player::new).collect(Collectors.toList());
        this.turnNumber = 1;
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

    public int getThemeIndex() {
        return themeIndex;
    }

    public PlayerId getFirstToGo() {
        return firstToGo;
    }

    public void setFirstToGo(PlayerId firstToGo) {
        this.firstToGo = firstToGo;
    }

    public int getTurnNumber() {
        return turnNumber;
    }

    public void addTurn() {
        this.turnNumber++;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public void setTurnNumber(int turnNumber) {
        this.turnNumber = turnNumber;
    }

    public LocalDateTime getBattleStartTime() {
        return battleStartTime;
    }

    public void setBattleStartTime(LocalDateTime battleStartTime) {
        this.battleStartTime = battleStartTime;
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

    public GameStage getGameStage() {
        if (players.size() < 2) {
            return GameStage.QUEUEING;
        }
        for (Player player : players) {
            if (!player.isReady()) return GameStage.QUEUEING;
        }

        for (Player player : players) {
            if (player.getBoard() == null) return GameStage.ARRANGING;
        }

        for (Player player : players) {
            if (player.hasLostBattle()) return GameStage.FINISHED;
        }

        return GameStage.BATTLE;
    }

    public PlayerId playersTurn() {
        if (turnNumber % 2 == 0) {
            return players
                    .stream()
                    .filter(p -> !firstToGo.equals(p.getId()))
                    .findAny()
                    .orElseThrow().getId();
        } else {
            return firstToGo;
        }
    }

    public void resetLobby() {
        if (getGameStage() != GameStage.FINISHED) {
            return;
        }

        for (Player player : players) {
            if (!player.votedToRestart()) {
                return;
            }
        }

        firstToGo = null;
        turnNumber = 1;
        battleStartTime = null;

        players.forEach(player -> {
            player.setBoard(null);
            player.setReady(false);
            player.setVoteToRestart(false);
        });
    }
}
