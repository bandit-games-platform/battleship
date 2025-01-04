import {useMutation} from "@tanstack/react-query";
import {submitShipArrangement} from "../services/ShipArrangementService.ts";
import {SubmitArrangementDto} from "../model/SubmitArrangementDto.ts";

export function useSubmitShipArrangement() {
    const {
        mutate,
        isPending,
        isError,
        isSuccess
    } = useMutation({
        mutationFn: (arrangement: SubmitArrangementDto) => submitShipArrangement(arrangement)
    });

    return {
        isPending,
        isError,
        isSuccess,
        submitShipArrangement: mutate
    }
}
