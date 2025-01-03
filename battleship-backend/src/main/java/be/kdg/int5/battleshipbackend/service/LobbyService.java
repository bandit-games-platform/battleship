package be.kdg.int5.battleshipbackend.service;

import be.kdg.int5.GameSDK;
import be.kdg.int5.battleshipbackend.domain.*;
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
        Lobby existingLobby = repository.getLobbyById(lobbyId);
        if (existingLobby == null) {
            return null;
        }

        if (existingLobby.getPlayer(playerId) != null) {
            logger.info("Player {} is already in the lobby, can't join again.", playerId.uuid());
            return null;
        }
        if (existingLobby.getPlayers().size() >= 2) {
            logger.info("Lobby has {} players, it is too full, denying join request!", existingLobby.getPlayers().size());
            return null;
        }

        existingLobby.addPlayer(playerId);

        sdk.patchLobby(
                new LobbyContext(lobbyId.uuid()),
                existingLobby.getOwnerId().uuid(),
                existingLobby.getPlayers().size(),
                existingLobby.getPlayers().size() >= 2
        );
        repository.updatedLobby(existingLobby);

        logger.info("Player {} has joined lobby {}, there are now {} players in the lobby.",
                playerId.uuid(), lobbyId.uuid(), existingLobby.getPlayers().size()
        );

        return existingLobby;
    }

    public Lobby playerReadyToggle(PlayerId playerId, LobbyId lobbyId) {
        Lobby loadedLobby = repository.getLobbyById(lobbyId);
        if (loadedLobby == null) return null;

        Player player = loadedLobby.getPlayer(playerId);
        player.setReady(!player.isReady());
        loadedLobby.replacePlayer(player);

        logger.info("Player {} is {}.", player.getId().uuid(), player.isReady()? "now ready to play" : "not ready to play");

        if (loadedLobby.getPlayers().size() > 1) {
            if (player.isReady() && loadedLobby.opponent(player).isReady()) {
                logger.info("Everyone in the lobby is ready, time to start the battle(ship)!");
                sdk.patchLobby(
                        new LobbyContext(lobbyId.uuid()),
                        loadedLobby.getOwnerId().uuid(),
                        loadedLobby.getPlayers().size(),
                        true
                );
            }
        }

        repository.updatedLobby(loadedLobby);
        return loadedLobby;
    }

    public Lobby getLobbyInformation(LobbyId lobbyId) {
        return repository.getLobbyById(lobbyId);
    }

    public boolean leaveLobby(PlayerId playerId, LobbyId lobbyId) {
        Lobby loadedLobby = repository.getLobbyById(lobbyId);
        if (loadedLobby == null) return false;

        boolean removedPlayer = loadedLobby.removePlayer(playerId);
        if (!removedPlayer) return false;

        logger.info("Player {} has now left the lobby {}.", playerId.uuid(), lobbyId.uuid());

        if (loadedLobby.getOwnerId().equals(playerId)) {
            List<Player> lobbyPlayers = loadedLobby.getPlayers();
            if (!lobbyPlayers.isEmpty()) loadedLobby.setOwnerId(lobbyPlayers.getFirst().getId());

            logger.info("Player who left was lobby owner, new owner {}", loadedLobby.getOwnerId().uuid());
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

    private void removeLobby(LobbyId lobbyId) {
        logger.info("No players left in lobby {}, closing it down.", lobbyId.uuid());
        sdk.closeLobby(new LobbyContext(lobbyId.uuid()));
        repository.removeLobbyById(lobbyId);
    }
}
