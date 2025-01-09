package be.kdg.int5.battleshipbackend.service;

import be.kdg.int5.battleshipbackend.BaseTest;
import be.kdg.int5.battleshipbackend.domain.*;
import be.kdg.int5.battleshipbackend.repository.LobbyRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


class ArrangeShipsServiceTest extends BaseTest {
    @Autowired
    private ArrangeShipsService service;
    @Autowired
    private LobbyRepository repository;

    private static final List<Ship> GOOD_ARRANGEMENT = Arrays.asList(
            new Ship(ShipType.CARRIER, new Coordinate(0, 1), false),
            new Ship(ShipType.BATTLESHIP, new Coordinate(2, 1), false),
            new Ship(ShipType.CRUISER, new Coordinate(5, 5), false),
            new Ship(ShipType.SUBMARINE, new Coordinate(3, 1), true),
            new Ship(ShipType.DESTROYER, new Coordinate(7, 3), true)
    );

    @BeforeEach
    void setUp() {
        // Arrange

        // Lobby in arranging state
        Lobby goodLobby = new Lobby(GOOD_LOBBY, PLAYER_ONE, Arrays.asList(PLAYER_ONE, PLAYER_TWO));
        goodLobby.getPlayers().forEach(p -> p.setReady(true));
        repository.save(goodLobby);

        // Lobby that is still queueing
        Lobby badLobby = new Lobby(BAD_LOBBY, PLAYER_ONE, List.of(PLAYER_ONE));
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
    void submitShipArrangementShouldFailForNonexistentLobby() {
        // Act
        boolean res = service.submitShipArrangement(NONEXISTENT_LOBBY, PLAYER_ONE, GOOD_ARRANGEMENT);
        // Assert
        assertFalse(res);
    }

    @Test
    void submitShipArrangementShouldFailForNonexistentPlayer() {
        // Act
        boolean res = service.submitShipArrangement(GOOD_LOBBY, NONEXISTENT_PLAYER, GOOD_ARRANGEMENT);
        // Assert
        assertFalse(res);
    }

    @Test
    void submitShipArrangementShouldFailForBadLobbyState() {
        // Act
        boolean res = service.submitShipArrangement(BAD_LOBBY, PLAYER_ONE, GOOD_ARRANGEMENT);
        // Assert
        assertFalse(res);
    }

    @Test
    void submitShipArrangementShouldSucceedForGoodLobbyPlayerAndArrangementAndCreateBoard() {
        // Act
        boolean res = service.submitShipArrangement(GOOD_LOBBY, PLAYER_TWO, GOOD_ARRANGEMENT);
        // Assert
        assertTrue(res);

        Lobby lobby = repository.getLobbyById(GOOD_LOBBY);
        assertNotNull(lobby);

        Player player = lobby.getPlayer(PLAYER_TWO);
        assertNotNull(player);

        assertNotNull(player.getBoard());
    }

    @Test
    void submitShipArrangementShouldFailForOverlappingShips() {
        // Arrange
        List<Ship> overlappingShips = Arrays.asList(
                new Ship(ShipType.CARRIER, new Coordinate(0, 1), true),
                new Ship(ShipType.BATTLESHIP, new Coordinate(2, 1), false),
                new Ship(ShipType.CRUISER, new Coordinate(5, 5), false),
                new Ship(ShipType.SUBMARINE, new Coordinate(3, 1), true),
                new Ship(ShipType.DESTROYER, new Coordinate(7, 3), true)
        );
        // Act
        boolean res = service.submitShipArrangement(GOOD_LOBBY, PLAYER_ONE, overlappingShips);
        // Assert
        assertFalse(res);
    }
}
