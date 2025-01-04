package be.kdg.int5.battleshipbackend.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Ship {
    private final ShipType type;
    private final Coordinate placement;
    private final boolean isVertical;

    private int hitCount;
    private final List<Coordinate> coordinates;

    public Ship(ShipType type, Coordinate placement, boolean isVertical) {
        this.type = type;
        this.placement = placement;
        this.isVertical = isVertical;

        this.hitCount = 0;
        this.coordinates = new ArrayList<>();
        computeCoordinates();
    }


    private void computeCoordinates() {
        coordinates.clear();
        for (int i = 0; i < type.getLength(); i++) {
            if (isVertical) {
                coordinates.add(new Coordinate(placement.row()+i, placement.col()));
            } else {
                coordinates.add(new Coordinate(placement.row(), placement.col()+i));
            }
        }
    }

    public boolean containsCoordinate(Coordinate coordinate) {
        return coordinates.contains(coordinate);
    }

    public boolean registerHitAndCheckIfSunk() {
        return ++hitCount >= type.getLength();
    }


    public ShipType getType() {
        return type;
    }

    public Coordinate getPlacement() {
        return placement;
    }

    public boolean isVertical() {
        return isVertical;
    }

    List<Coordinate> getCoordinates() {
        return coordinates;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Ship ship)) return false;
        return isVertical() == ship.isVertical() && getType() == ship.getType() && Objects.equals(getPlacement(), ship.getPlacement());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getType(), getPlacement(), isVertical());
    }
}
