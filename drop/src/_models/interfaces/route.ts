export interface RouteOptions {
    actionsPerRun: number,
    maxCycles: number
}

export interface TimeToNextTrxRange {
    min: number;
    max: number;
};

export interface TrxNumberTargetInterimFarmingSessionRange {
    min: number;
    max: number;
};

export interface TrxNumberTargetRange {
    min: number;
    max: number;
};

export interface ActionTypeWeight {
    type: string,
    value: number
}