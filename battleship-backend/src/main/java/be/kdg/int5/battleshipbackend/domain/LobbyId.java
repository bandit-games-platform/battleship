package be.kdg.int5.battleshipbackend.domain;

import java.util.Objects;
import java.util.UUID;

public record LobbyId(UUID uuid) {
    public LobbyId {
        Objects.requireNonNull(uuid);
    }
}
