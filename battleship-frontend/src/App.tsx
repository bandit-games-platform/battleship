import {BrowserRouter, Route, Routes} from "react-router-dom";
import {BattleshipGame} from "./pages/BattleshipGame.tsx";

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
