import { BotStatistics, DummyWallet } from "./accounts";
import { Action, RouteAction, Status } from "./actions";

export interface ActionActivityReport {
    routeAction: RouteAction;
    status: Status;
}

export interface WorkFlowReport {
    status: any;
}