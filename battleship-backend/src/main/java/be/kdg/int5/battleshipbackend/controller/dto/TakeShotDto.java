package be.kdg.int5.battleshipbackend.controller.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class TakeShotDto {
    @Valid
    private IdentityDto identity;
    @Min(0)
    @Max(9)
    private int column;
    @Min(0)
    @Max(9)
    private int row;

    public TakeShotDto() {
    }

    public TakeShotDto(IdentityDto identity, int column, int row) {
        this.identity = identity;
        this.column = column;
        this.row = row;
    }

    public IdentityDto getIdentity() {
        return identity;
    }

    public void setIdentity(IdentityDto identity) {
        this.identity = identity;
    }

    public int getColumn() {
        return column;
    }

    public void setColumn(int column) {
        this.column = column;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }
}
