package be.kdg.int5.battleshipbackend.domain;

import java.util.Objects;

import static be.kdg.int5.battleshipbackend.config.GameConfig.BOARD_COLS;
import static be.kdg.int5.battleshipbackend.config.GameConfig.BOARD_ROWS;

public record Coordinate(int row, int col) {
    public Coordinate {
        if (row < 0 || row >= BOARD_ROWS) throw new IllegalArgumentException("coordinate row not on board");
        if (col < 0 || col >= BOARD_COLS) throw new IllegalArgumentException("coordinate col not on board");
    }

    @Override
    public String toString() {
        return (char)('A'+col) + "" + row;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Coordinate that)) return false;
        return row == that.row && col == that.col;
    }

    @Override
    public int hashCode() {
        return Objects.hash(row, col);
    }
}
