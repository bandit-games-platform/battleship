package be.kdg.int5.battleshipbackend.domain;

import java.util.Objects;
import java.util.UUID;

public record PlayerId(UUID uuid) {
    public PlayerId {
        Objects.requireNonNull(uuid);
    }
}
