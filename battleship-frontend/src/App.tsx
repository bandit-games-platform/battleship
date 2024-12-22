import {BrowserRouter, Route, Routes} from "react-router-dom";
import {BattleshipGame} from "./page/BattleshipGame.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/battleship"} element={<BattleshipGame />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
