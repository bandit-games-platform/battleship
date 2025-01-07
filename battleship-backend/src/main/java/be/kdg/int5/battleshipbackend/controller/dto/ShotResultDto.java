package be.kdg.int5.battleshipbackend.controller.dto;

public class ShotResultDto {
    private String shotResult;

    public ShotResultDto() {
    }

    public ShotResultDto(String shotResult) {
        this.shotResult = shotResult;
    }

    public String getShotResult() {
        return shotResult;
    }

    public void setShotResult(String shotResult) {
        this.shotResult = shotResult;
    }
}
