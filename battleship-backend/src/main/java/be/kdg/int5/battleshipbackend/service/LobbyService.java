package be.kdg.int5.battleshipbackend.service;

import be.kdg.int5.GameSDK;
import be.kdg.int5.battleshipbackend.domain.Lobby;
import be.kdg.int5.battleshipbackend.domain.LobbyId;
import be.kdg.int5.battleshipbackend.domain.Player;
import be.kdg.int5.battleshipbackend.domain.PlayerId;
import be.kdg.int5.battleshipbackend.repository.LobbyRepository;
import be.kdg.int5.domain.GameContext;
import be.kdg.int5.domain.LobbyContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

        newLobby.addPlayer(ownerId);

        return repository.save(newLobby);
    }

    public Lobby joinExistingLobby(PlayerId playerId, LobbyId lobbyId) {
        Lobby existingLobby = repository.getLobby(lobbyId);
        if (existingLobby == null) {
            logger.info("Existing lobby not found, creating a new one");
            return startNewLobby(playerId);
        }

        existingLobby.addPlayer(playerId);

        sdk.patchLobby(
                new LobbyContext(lobbyId.uuid()),
                existingLobby.getOwnerId().uuid(),
                existingLobby.getPlayers().size(),
                existingLobby.getPlayers().size() >= 2
        );

        logger.info("Player {} has joined lobby {}, there are now {} players in the lobby.",
                playerId.uuid(), lobbyId.uuid(), existingLobby.getPlayers().size()
        );

        return existingLobby;
    }

    public boolean leaveLobby(PlayerId playerId, LobbyId lobbyId) {
        Lobby loadedLobby = repository.getLobby(lobbyId);
        if (loadedLobby == null) return false;

        boolean removedPlayer = loadedLobby.removePlayer(playerId);
        if (!removedPlayer) return false;

        if (loadedLobby.getOwnerId().equals(playerId)) {
            List<Player> lobbyPlayers = loadedLobby.getPlayers();
            if (!lobbyPlayers.isEmpty()) loadedLobby.setOwnerId(lobbyPlayers.getFirst().getId());
        }

        if (loadedLobby.getPlayers().isEmpty()) removeLobby(lobbyId);
        else {
            sdk.patchLobby(
                    new LobbyContext(lobbyId.uuid()),
                    loadedLobby.getOwnerId().uuid(),
                    loadedLobby.getPlayers().size(),
                    loadedLobby.getPlayers().size() >= 2
            );
            repository.updatedLobby(loadedLobby);
        }

        return true;
    }

    public void removeLobby(LobbyId lobbyId) {
        sdk.closeLobby(new LobbyContext(lobbyId.uuid()));
        repository.removeLobby(lobbyId);
    }
}
