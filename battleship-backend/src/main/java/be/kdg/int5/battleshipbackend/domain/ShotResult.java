package be.kdg.int5.battleshipbackend.domain;

public record ShotResult(ShotResultType resultType, Ship target) {
    public ShotResult {
        if (resultType == ShotResultType.MISS && target != null) {
            throw new IllegalStateException("Target should not be provided on a MISS!");
        }

        if (resultType != ShotResultType.MISS && target == null) {
            throw new IllegalStateException("Target should be provided when HIT or SUNK!");
        }
    }
}
