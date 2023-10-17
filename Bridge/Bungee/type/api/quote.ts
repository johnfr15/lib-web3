import { Token } from "../types";

export type Quote = {
    routes: RouteData[];
    fromChainId: number;
    fromToken: Token;
    toChainId: number;
    toToken: Token;
    refuel: RefuelData;
};

export type QuoteParams = {
    fromChainId: string; // Chain id of source chain
    fromTokenAddress: string; // Token address on source chain
    toChainId: string; // Chain id of destination chain
    toTokenAddress: string; // Token address on destination chain
    fromAmount: string; // Amount of sending tokens
    userAddress: string; // Address of the user (used to check approvals)
    uniqueRoutesPerBridge: boolean; // Flag to return only the best route per bridge
    sort: string; // Param to sort routes based on (output, gas, time)
};

export type QuoteOptions = {
    recipient?: string; // Address of the recipient
    disableSwapping?: boolean; // Flag to specify if routes with dex swaps should be ignored
    includeDexes?: string[]; // Specify Dexes that should be included in routes
    excludeDexes?: string[]; // Specify Dexes that should be excluded in routes
    includeBridges?: string[]; // Specify Bridges that should be included in routes
    excludeBridges?: string[]; // Specify Bridges that should be excluded in routes
    maxUserTxs?: string; // Maximum number of transactions
    singleTxOnly?: boolean; // Only get quotes with one user transaction to bridge
    isContractCall?: boolean; // Only get quotes that are compatible with contracts
    bridgeWithGas?: boolean; // Include gas transfer with bridging transaction
    bridgeWithInsurance?: boolean; // Include insurance with bridging transaction
    defaultBridgeSlippage?: string; // Default bridge slippage for the route in percent between 0 and 100
    defaultSwapSlippage?: string; // Default swap slippage for the route in percent between 0 and 100
    destinationPayload?: string; // Destination payload for contract call
    destinationGasLimit?: string; // Destination gas limit for contract call
    feePercent?: string; // Fee percentage to be cut (only available on SocketGateway Contracts)
    feeTakerAddress?: string; // Fee taker address where the fee is sent (only available on Socket Gateway Contracts)
}

export type GasFees = {
    gasLimit: number;
    feesInUsd: number;
    asset: Token;
    gasAmount: string;
};

export type IntegratorFee = {
    feeTakerAddress: string;
    amount: string;
    asset: Token;
};

export type RouteData = {
    routeId: string;
    isOnlySwapRoute: boolean;
    fromAmount: string;
    chainGasBalances: Record<string, number>;
    minimumGasBalances: Record<string, number>;
    toAmount: string;
    usedBridgeNames: string[];
    totalUserTx: number;
    totalGasFeesInUsd: number;
    recipient: string;
    sender: string;
    userTxs: Array<Object>; // You may need to define this type based on the actual structure
    receivedValueInUsd: number;
    inputValueInUsd: number;
    outputValueInUsd: number;
    serviceTime: number;
    maxServiceTime: number;
    integratorFee: IntegratorFee;
    t2bReceiverAddress: string;
    extraData: Record<string, any>; // You may need to define this type based on the actual structure
};

export type RefuelData = {
    fromAmount: string;
    toAmount: string;
    gasFees: GasFees;
    recipient: string;
    serviceTime: number;
    fromToken: Token;
    toToken: Token;
    fromChainId: number;
    toChainId: number;
};