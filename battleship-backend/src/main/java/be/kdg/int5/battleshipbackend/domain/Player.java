package be.kdg.int5.battleshipbackend.domain;

public class Player {
    private final PlayerId id;
    private Board board;

    public Player(PlayerId id) {
        this.id = id;
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

    public boolean hasLostBattle() {
        return board.hasLostBattle();
    }
}
