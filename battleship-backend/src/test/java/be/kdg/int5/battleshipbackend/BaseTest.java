package be.kdg.int5.battleshipbackend;

import be.kdg.int5.battleshipbackend.domain.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@SpringBootTest
@Import(TestConfig.class)
@ActiveProfiles("test")
public abstract class BaseTest {
    protected static final LobbyId NONEXISTENT_LOBBY = new LobbyId(UUID.randomUUID());
    protected static final LobbyId BAD_LOBBY = new LobbyId(UUID.randomUUID());
    protected static final LobbyId GOOD_LOBBY = new LobbyId(UUID.randomUUID());
    protected static final PlayerId NONEXISTENT_PLAYER = new PlayerId(UUID.randomUUID());
    protected static final PlayerId PLAYER_ONE = new PlayerId(UUID.randomUUID());
    protected static final PlayerId PLAYER_TWO = new PlayerId(UUID.randomUUID());

    protected static final List<Ship> GOOD_ARRANGEMENT = List.of(
            new Ship(ShipType.CARRIER, new Coordinate(0, 1), false),
            new Ship(ShipType.BATTLESHIP, new Coordinate(2, 1), false),
            new Ship(ShipType.CRUISER, new Coordinate(5, 5), false),
            new Ship(ShipType.SUBMARINE, new Coordinate(3, 1), true),
            new Ship(ShipType.DESTROYER, new Coordinate(7, 3), true)
    );
}

