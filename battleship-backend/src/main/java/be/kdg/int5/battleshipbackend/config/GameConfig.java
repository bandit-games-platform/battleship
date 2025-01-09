package be.kdg.int5.battleshipbackend.config;

import be.kdg.int5.GameSDK;
import be.kdg.int5.domain.GameContext;
import be.kdg.int5.domain.Rule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.Arrays;

@Configuration
@Profile("!test")
public class GameConfig {
    @Value("${bandit_sdk.base_url.game_registry}")
    private String gameRegistryUrl;
    @Value("${bandit_sdk.base_url.gameplay}")
    private String gameplayUrl;
    @Value("${bandit_sdk.base_url.statistics}")
    private String statisticsUrl;
    @Value("${bandit_sdk.api_key}")
    private String apiKey;

    @Bean
    public GameSDK gameSDK() {
        return new GameSDK.Builder()
                .gameRegistryBaseUrl(gameRegistryUrl)
                .gameplayBaseUrl(gameplayUrl)
                .statisticsBaseUrl(statisticsUrl)
                .init(apiKey);
    }

    @Value("${frontend.game_host_url}")
    private String hostUrl;
    @Value("${frontend.external_assets.base_url}")
    private String assetsBaseUrl;

    @Bean
    public GameContext gameContext(GameSDK gameSDK) {
        return gameSDK.registerGame(
                "Battleship",
                hostUrl,
                "A Classic Game... Reimagined.",
                null,
                assetsBaseUrl+"/icon.png",
                assetsBaseUrl+"/cover_art.png",
                Arrays.asList(
                        new Rule(1, "The two players first must arrange all their ships on the board then press Ready. Once both players are ready the game starts."),
                        new Rule(2, "Each turn a player picks a grid cell on the board to fire at."),
                        new Rule(3, "If the grid cell has part of an enemy ship on it, that part will be damaged and the player who fired will be told it is a Hit! They get to go again until they Miss."),
                        new Rule(4, "If the grid cell did not have an enemy ship, it is a Miss! It is now the other player's turn!"),
                        new Rule(5, "When a ship has all of its parts Hit, it Sinks."),
                        new Rule(6, "The game goes on until a player's ships have all Sunk. At this point the other player is declared the Winner!")
                ),
                Arrays.asList(
                        assetsBaseUrl+"/cover_art.png",
                        assetsBaseUrl+"/screenshots/board_arrangement.png",
                        assetsBaseUrl+"/screenshots/board_targeting.png",
                        assetsBaseUrl+"/screenshots/board_hit.png",
                        assetsBaseUrl+"/screenshots/all_ships_sunk.png"
                ),
                Arrays.stream(Achievements.values()).map(Achievements::toSDK).toList()
        );
    }
}
