import axios from "axios";
import {BattleStatus} from "../model/BattleStatus.ts";
import {ShotDto} from "../model/ShotDto.ts";
import {ShotResult} from "../model/ShotResult.ts";

export async function getBattleStatus(playerId: string, lobbyId: string) {
    const {data: battleStatus} = await axios.get<BattleStatus>("/battle/status?playerId=" + playerId + "&lobbyId=" + lobbyId);
    return battleStatus;
}

export async function shootShot(shotDto: ShotDto) {
    const {data: shotResult, status} = await axios.post<ShotResult>("/battle/shoot", shotDto)
    return {shotResult, status}
}
