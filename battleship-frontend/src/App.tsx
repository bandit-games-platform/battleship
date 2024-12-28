import {BrowserRouter, Route, Routes} from "react-router-dom";
import {BattleshipGame} from "./pages/BattleshipGame.tsx";
import axios from "axios";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

axios.defaults.baseURL = import.meta.env.VITE_BS_BACKEND_URL;
const queryClient = new QueryClient();

function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/battleship"} element={<BattleshipGame />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
