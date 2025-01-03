package be.kdg.int5.battleshipbackend.domain;

public class Player {
    private final PlayerId id;
    private boolean ready;
    private Board board;

    public Player(PlayerId id) {
        this.id = id;
        this.ready = false;
        this.board = null;
    }

    public PlayerId getId() {
        return id;
    }

    public Board getBoard() {
        return board;
    }

    public void setBoard(Board board) {
        this.board = board;
    }

    public boolean isReady() {
        return ready;
    }

    public void setReady(boolean ready) {
        this.ready = ready;
    }

    public boolean hasLostBattle() {
        return board.hasLostBattle();
    }
}
