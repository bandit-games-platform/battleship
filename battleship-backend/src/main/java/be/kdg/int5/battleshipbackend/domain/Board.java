package be.kdg.int5.battleshipbackend.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class Board {
    public static final int BOARD_ROWS = 10;
    public static final int BOARD_COLS = 10;

    private final List<Ship> aliveShips;
    private final List<Ship> sunkShips;
    private final Set<Coordinate> shots;

    public Board(List<Ship> arrangedShips) {
        if (!isValidArrangement(arrangedShips)) throw new IllegalStateException("Some ships seem to be overlapping in this arrangement");
        this.aliveShips = arrangedShips
                .stream()
                .map(s -> new Ship(s.getType(), s.getPlacement(), s.isVertical()))
                .collect(Collectors.toList());
        this.sunkShips = new ArrayList<>();
        this.shots = new HashSet<>();
    }

    private boolean isValidArrangement(List<Ship> ships) {
        Set<Coordinate> occupiedCoordinates = new HashSet<>();
        for (Ship ship : ships) {
            for (Coordinate shipSection : ship.getCoordinates()) {
                if (occupiedCoordinates.contains(shipSection)) {
                    return false;
                }
                occupiedCoordinates.add(shipSection);
            }
        }
        return true;
    }


    public ShotResult checkShot(Coordinate targetCoordinate) {
        if (!shots.add(targetCoordinate)) throw new IllegalArgumentException("This coordinate has already been fired at!");

        for (Ship ship : aliveShips) {
            if (ship.containsCoordinate(targetCoordinate)) {
                boolean hasSunk = ship.registerHitAndCheckIfSunk();

                if (hasSunk) {
                    aliveShips.remove(ship);
                    sunkShips.add(ship);
                    return new ShotResult(ShotResultType.SUNK, ship);
                }
                return new ShotResult(ShotResultType.HIT, ship);
            }
        }
        return new ShotResult(ShotResultType.MISS, null);
    }

    public boolean hasLostBattle() {
        return aliveShips.isEmpty();
    }


    public List<Ship> getAliveShips() {
        return aliveShips;
    }

    public List<Ship> getSunkShips() {
        return sunkShips;
    }

    public Set<Coordinate> getShots() {
        return shots;
    }
}
