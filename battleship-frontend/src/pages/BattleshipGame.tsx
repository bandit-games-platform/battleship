import {CanvasManager} from "../context/CanvasManager.tsx";
import {useState} from "react";
import {MainMenu} from "../scenes/MainMenu.tsx";
import {LobbyQueue} from "../scenes/LobbyQueue.tsx";

export function BattleshipGame() {
    const [scene, setScene] = useState<string>("main_menu");

    return (
        <CanvasManager>
            <>
                Scene: {scene}
                {scene === "main_menu" && <MainMenu setScene={setScene} />}
                {scene === "lobby_queue" && <LobbyQueue setScene={setScene} />}
            </>
        </CanvasManager>
    )
}
