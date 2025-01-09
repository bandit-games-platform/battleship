package be.kdg.int5.battleshipbackend;

import be.kdg.int5.battleshipbackend.domain.LobbyId;
import be.kdg.int5.battleshipbackend.domain.PlayerId;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

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
}

