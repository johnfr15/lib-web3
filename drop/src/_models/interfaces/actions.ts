import { DummyWallet } from "./accounts";

export interface Action {
    blockchain: string;
    protocols: Protocol[];
    type: string;
}

export interface RouteAction {
    blockchain:  string;
    protocol: string;
    type: string
}

export enum Status {
    Error = 'error',
    InProgress = 'in progress',
    Success = 'success'
}



export interface Protocol {
    actions: string[];
    name: string;
}