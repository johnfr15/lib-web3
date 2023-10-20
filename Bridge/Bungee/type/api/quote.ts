import { AddressLike } from "ethers";
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
    fromChainId: number; // Chain id of source chain
    fromTokenAddress: AddressLike; // Token address on source chain
    toChainId: number; // Chain id of destination chain
    toTokenAddress: AddressLike; // Token address on destination chain
    fromAmount: bigint; // Amount of sending tokens
    userAddress: AddressLike; // Address of the user (used to check approvals)
    uniqueRoutesPerBridge: boolean; // Flag to return only the best route per bridge
    sort: 'output' | 'gas' | 'time'; // Param to sort routes based on (output, gas, time)
};

export type QuoteOptions = {
    recipient?: AddressLike; // Address of the recipient
    disableSwapping?: boolean; // Flag to specify if routes with dex swaps should be ignored
    includeDexes?: Dexes[]; // Specify Dexes that should be included in routes
    excludeDexes?: Dexes[]; // Specify Dexes that should be excluded in routes
    includeBridges?: Bridges[]; // Specify Bridges that should be included in routes
    excludeBridges?: Bridges[]; // Specify Bridges that should be excluded in routes
    maxUserTxs?: number; // Maximum number of transactions
    singleTxOnly?: boolean; // Only get quotes with one user transaction to bridge
    isContractCall?: boolean; // Only get quotes that are compatible with contracts
    bridgeWithGas?: boolean; // Include gas transfer with bridging transaction
    bridgeWithInsurance?: boolean; // Include insurance with bridging transaction
    defaultBridgeSlippage?: number; // Default bridge slippage for the route in percent between 0 and 100
    defaultSwapSlippage?: number; // Default swap slippage for the route in percent between 0 and 100
    destinationPayload?: string; // Destination payload for contract call
    destinationGasLimit?: string; // Destination gas limit for contract call
    feePercent?: number; // Fee percentage to be cut (only available on SocketGateway Contracts)
    feeTakerAddress?: AddressLike; // Fee taker address where the fee is sent (only available on Socket Gateway Contracts)
}

export type GasFees = {
    gasLimit: number;
    feesInUsd: number;
    asset: Token;
    gasAmount: bigint;
};

export type IntegratorFee = {
    feeTakerAddress: AddressLike;
    amount: bigint;
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
    userTxs: UserTx[]; // You may need to define this type based on the actual structure
    receivedValueInUsd: number;
    inputValueInUsd: number;
    outputValueInUsd: number;
    serviceTime: number;
    maxServiceTime: number;
    integratorFee: IntegratorFee;
    t2bReceiverAddress: string;
    extraData: Record<string, any>; // You may need to define this type based on the actual structure
};

export type UserTx =  {
    userTxType: string;
    txType: string;
    chainId: number;
    toAmount: string;
    toAsset: Token
    stepCount: number;
    routePath: string;
    sender: AddressLike;
    approvalData: null | any; 
    steps: UserStep[]; 
    gasFees: {
        gasAmount: string;
        feesInUsd: number;
        asset: Token;
        gasLimit: number;
    };
    serviceTime: number;
    recipient: AddressLike;
    maxServiceTime: number;
    bridgeSlippage: number;
    userTxIndex: number;
}

export type UserStep = {
    type: string;
    protocol: {
      name: string;
      displayName: string;
      icon: string;
      securityScore: number;
      robustnessScore: number;
    };
    fromChainId: number;
    fromAsset: Token;
    fromAmount: string;
    toChainId: number;
    toAsset: Token;
    toAmount: string;
    bridgeSlippage: number;
    minAmountOut: string;
    protocolFees: {
      amount: string;
      asset: Token; 
      feesInUsd: number;
    };
    gasFees: {
      gasAmount: string;
      gasLimit: number;
      asset: Token; 
      feesInUsd: number;
    };
    serviceTime: number;
    maxServiceTime: number;
    extraData: object;
}

export type RefuelData = {
    fromAmount: bigint;
    toAmount: bigint;
    gasFees: GasFees;
    recipient: AddressLike;
    serviceTime: number;
    fromToken: Token;
    toToken: Token;
    fromChainId: number;
    toChainId: number;
};

export type Dexes =  'oneinch' | 'zerox' | 'rainbow'

export type Bridges =
| 'hop'
| 'anyswap'
| 'anyswap-router-v4'
| 'anyswap-router-v6'
| 'polygon-bridge'
| 'arbitrum-bridge'
| 'hyphen'
| 'across'
| 'optimism-bridge'
| 'celer'
| 'refuel-bridge'
| 'stargate'
| 'connext'
| 'cctp'
| 'synapse'
| 'base-bridge'
| 'zora-bridge'
| 'zksync-native';