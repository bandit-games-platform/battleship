import {ShotDto} from "../model/ShotDto.ts";
import {useMutation} from "@tanstack/react-query";
import {shootShot} from "../services/BattleService.ts";

export function useShootShot() {
    const {
        mutateAsync,
        isPending,
        isError,
        data: result
    } = useMutation({
        mutationFn: (shotDto: ShotDto) => shootShot(shotDto)
    });

    return {
        isPending,
        isError,
        shootShot: mutateAsync,
        result
    }
}