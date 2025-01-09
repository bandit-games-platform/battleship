package be.kdg.int5.battleshipbackend.domain;

public class Player {
    private final PlayerId id;
    private boolean ready;
    private boolean voteToRestart;
    private Board board;

    public Player(PlayerId id) {
        this.id = id;
        this.ready = false;
        this.voteToRestart = false;
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

    public boolean votedToRestart() {
        return voteToRestart;
    }

    public void setVoteToRestart(boolean voteToRestart) {
        this.voteToRestart = voteToRestart;
    }

    public boolean hasLostBattle() {
        return board.hasLostBattle();
    }
}
