package be.kdg.int5.battleshipbackend.service;

import be.kdg.int5.battleshipbackend.BaseTest;
import be.kdg.int5.battleshipbackend.domain.*;
import be.kdg.int5.battleshipbackend.repository.LobbyRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

class BattleServiceTest extends BaseTest {
    @Autowired
    private BattleService service;
    @Autowired
    private ArrangeShipsService arrangeShipsService;
    @Autowired
    private LobbyRepository repository;

    private static final Coordinate GOOD_SHOT = new Coordinate(7, 3);
    private static final Coordinate GOOD_SHOT_TWO = new Coordinate(8, 3);
    private static final Coordinate BAD_SHOT = new Coordinate(0, 0);

    @BeforeEach
    void setUp() {
        // Arrange

        // Lobby in battle state
        Lobby goodLobby = new Lobby(GOOD_LOBBY, PLAYER_ONE, Arrays.asList(PLAYER_ONE, PLAYER_TWO));
        goodLobby.getPlayers().forEach(p -> p.setReady(true));
        goodLobby.setFirstToGo(PLAYER_ONE);
        repository.save(goodLobby);
        arrangeShipsService.submitShipArrangement(GOOD_LOBBY, PLAYER_ONE, GOOD_ARRANGEMENT);
        arrangeShipsService.submitShipArrangement(GOOD_LOBBY, PLAYER_TWO, GOOD_ARRANGEMENT);

        // Lobby in arranging state
        Lobby badLobby = new Lobby(BAD_LOBBY, PLAYER_ONE, Arrays.asList(PLAYER_ONE, PLAYER_TWO));
        badLobby.getPlayers().forEach(p -> p.setReady(true));
        repository.save(badLobby);
    }

    @AfterEach
    void tearDown() {
        // Annihilate
        repository.removeLobbyById(GOOD_LOBBY);
        repository.removeLobbyById(BAD_LOBBY);
    }

    @Test
    void takeShotShouldFailForNonexistentLobby() {
        // Act
        ShotResult res = service.takeShot(NONEXISTENT_LOBBY, PLAYER_ONE, GOOD_SHOT);
        // Assert
        assertNull(res);
    }

    @Test
    void takeShotShouldFailForNonexistentPlayer() {
        // Act
        ShotResult res = service.takeShot(GOOD_LOBBY, NONEXISTENT_PLAYER, GOOD_SHOT);
        // Assert
        assertNull(res);
    }

    @Test
    void takeShotShouldFailForOtherPlayersTurn() {
        // Act
        ShotResult res = service.takeShot(GOOD_LOBBY, PLAYER_TWO, GOOD_SHOT);
        // Assert
        assertNull(res);
    }

    @Test
    void takeShotShouldMissForBadShot() {
        // Act
        ShotResult res = service.takeShot(GOOD_LOBBY, PLAYER_ONE, BAD_SHOT);
        // Assert
        assertNotNull(res);

        assertEquals(ShotResultType.MISS, res.resultType());

        assertNull(res.target());
    }

    @Test
    void takeShotShouldHitForGoodShot() {
        // Act
        ShotResult res = service.takeShot(GOOD_LOBBY, PLAYER_ONE, GOOD_SHOT);
        // Assert
        assertNotNull(res);

        assertEquals(ShotResultType.HIT, res.resultType());

        assertNotNull(res.target());
    }

    @Test
    void takeShotShouldGiveSunkForBothGoodShotsOnDestroyer() {
        // Arrange
        service.takeShot(GOOD_LOBBY, PLAYER_ONE, GOOD_SHOT);

        // Act
        ShotResult res = service.takeShot(GOOD_LOBBY, PLAYER_ONE, GOOD_SHOT_TWO);
        // Assert
        assertNotNull(res);

        assertEquals(ShotResultType.SUNK, res.resultType());

        assertNotNull(res.target());

        assertEquals(ShipType.DESTROYER, res.target().getType());
    }
}