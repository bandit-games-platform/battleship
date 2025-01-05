import axios from "axios";
import {BattleStatus} from "../model/BattleStatus.ts";

export async function getBattleStatus(playerId: string, lobbyId: string) {
    const {data: battleStatus} = await axios.get<BattleStatus>("/battle/status?playerId=" + playerId + "&lobbyId=" + lobbyId);
    return battleStatus;
}