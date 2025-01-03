package be.kdg.int5.battleshipbackend.controller;

import be.kdg.int5.battleshipbackend.controller.dto.SubmitArrangementDto;
import be.kdg.int5.battleshipbackend.domain.LobbyId;
import be.kdg.int5.battleshipbackend.domain.PlayerId;
import be.kdg.int5.battleshipbackend.domain.Ship;
import be.kdg.int5.battleshipbackend.service.ArrangeShipsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("/arrange_ships")
public class ArrangeShipsController {
    private final ArrangeShipsService arrangeShipsService;

    public ArrangeShipsController(ArrangeShipsService arrangeShipsService) {
        this.arrangeShipsService = arrangeShipsService;
    }

    @PostMapping
    public ResponseEntity<Void> submitShipArrangement(@RequestBody @Valid SubmitArrangementDto dto) {
        boolean arrangementAccepted = arrangeShipsService.submitShipArrangement(
                new LobbyId(dto.getIdentity().getLobbyId()),
                new PlayerId(dto.getIdentity().getPlayerId()),
                dto.getArrangedShips()
                        .stream()
                        .map(shipRecord -> new Ship(
                                shipRecord.type(),
                                shipRecord.placement(),
                                shipRecord.isVertical())
                        )
                        .toList()
        );

        if (!arrangementAccepted) return new ResponseEntity<>(HttpStatus.CONFLICT);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
