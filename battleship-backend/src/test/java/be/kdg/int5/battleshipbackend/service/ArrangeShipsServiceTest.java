package be.kdg.int5.battleshipbackend.service;

import be.kdg.int5.battleshipbackend.BaseTest;
import be.kdg.int5.battleshipbackend.repository.LobbyRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;


class ArrangeShipsServiceTest extends BaseTest {
    @Autowired
    private ArrangeShipsService service;
    @Autowired
    private LobbyRepository repository;


    @BeforeEach
    void setUp() {

    }

    @AfterEach
    void tearDown() {

    }

    @Test
    void submitShipArrangement() {
    }
}
