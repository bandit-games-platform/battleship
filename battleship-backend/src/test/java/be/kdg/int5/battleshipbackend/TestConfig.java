package be.kdg.int5.battleshipbackend;

import be.kdg.int5.GameSDK;
import be.kdg.int5.domain.GameContext;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestConfig {

    @Bean
    public GameSDK gameSDK() {
        return Mockito.mock(GameSDK.class);
    }

    @Bean
    public GameContext gameContext() {
        return Mockito.mock(GameContext.class);
    }

}
