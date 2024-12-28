package be.kdg.int5.battleshipbackend.service;

import be.kdg.int5.GameSDK;
import be.kdg.int5.battleshipbackend.domain.Lobby;
import be.kdg.int5.battleshipbackend.domain.LobbyId;
import be.kdg.int5.battleshipbackend.domain.PlayerId;
import be.kdg.int5.battleshipbackend.repository.LobbyRepository;
import be.kdg.int5.domain.GameContext;
import be.kdg.int5.domain.LobbyContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class LobbyService {
    private final Logger logger = LoggerFactory.getLogger(LobbyService.class);

    private final LobbyRepository repository;
    private final GameSDK sdk;
    private final GameContext ctx;

    public LobbyService(LobbyRepository repository, GameSDK sdk, GameContext ctx) {
        this.repository = repository;
        this.sdk = sdk;
        this.ctx = ctx;
    }

    public Lobby startNewLobby(PlayerId ownerId) {
        LobbyContext sdkLobby = sdk.createLobby(ctx, ownerId.uuid(), 2);
        LobbyId newLobbyId = new LobbyId(sdkLobby.lobbyId());
        logger.info("New lobby for owner: {} was registered with platform with id: {}", ownerId, newLobbyId);

        Lobby newLobby = new Lobby(
                newLobbyId,
                ownerId,
                new ArrayList<>()
        );

        return repository.save(newLobby);
    }
}
