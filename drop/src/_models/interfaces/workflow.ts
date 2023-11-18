import { Action, RouteAction } from "./actions";
import { DummyWallet, Signer } from "./accounts";
import { RouteOptions } from "./route";

export interface BotWorkFlow {
    actions: Action[],
    dummyWallet: DummyWallet,
    randomNumberArray: number[],
    route: RouteAction[],
    routeOptions: RouteOptions
}