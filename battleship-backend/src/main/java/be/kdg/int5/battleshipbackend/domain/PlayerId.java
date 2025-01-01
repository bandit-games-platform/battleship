package be.kdg.int5.battleshipbackend.domain;

import java.util.Objects;
import java.util.UUID;

public record PlayerId(UUID uuid) {
    public PlayerId {
        Objects.requireNonNull(uuid);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PlayerId playerId)) return false;
        return Objects.equals(uuid, playerId.uuid);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(uuid);
    }
}
