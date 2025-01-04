package be.kdg.int5.battleshipbackend.controller.dto;

import be.kdg.int5.battleshipbackend.domain.Coordinate;
import be.kdg.int5.battleshipbackend.domain.ShipType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class SubmitArrangementDto {
    @Valid
    private IdentityDto identity;
    @NotNull
    @NotEmpty
    private List<ShipArrangementRecord> arrangedShips;

    public SubmitArrangementDto() {
    }

    public SubmitArrangementDto(IdentityDto identity, List<ShipArrangementRecord> arrangedShips) {
        this.identity = identity;
        this.arrangedShips = arrangedShips;
    }

    public @Valid IdentityDto getIdentity() {
        return identity;
    }

    public @NotNull @NotEmpty List<ShipArrangementRecord> getArrangedShips() {
        return arrangedShips;
    }

    public record ShipArrangementRecord(ShipType type, Coordinate placement, boolean isVertical) {}
}
