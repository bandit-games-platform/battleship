import axios from "axios";
import {SubmitArrangementDto} from "../model/SubmitArrangementDto.ts";

export async function submitShipArrangement(dto: SubmitArrangementDto) {
    await axios.post("/arrange_ships", dto)
}
