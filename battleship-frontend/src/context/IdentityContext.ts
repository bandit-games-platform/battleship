import {createContext} from "react";

export interface IIdentityContext {
    playerId: string,
    lobbyId?: string
}

export const IdentityContext = createContext<IIdentityContext>({
    playerId: "",
    lobbyId: undefined
});
