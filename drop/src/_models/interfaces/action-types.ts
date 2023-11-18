import { Signer } from "./accounts";

export interface AddLiquidity {
    signer: Signer;
    addressA: string;
    amountA: string | null;
    addressB: string;
    amountB: string | null;
    max: boolean;
    network: string;
    slipage: number; // percentage
    deadline: number | null;
}

export interface Borrow {
    signer: Signer;
    tokenA: string;
    tokenB: string;
    percent: number;
    network: string;
    deadline: number | null;
}

export interface Lend {
    signer: Signer;
    tokenA: string;
    tokenB: string;
    percent: number;
    network: string;
    deadline: number | null;
}

export interface MintNFT {
    signer: Signer;
    network: string;
    deadline: number | null;
}

export interface RemoveLiquidity {
    signer: Signer;
    tokenA: string;
    tokenB: string;
    percent: number;
    network: string;
    slipage: number; // default 0.5%
    deadline: number | null;
}

export interface Swap {
    signer: Signer,
    path: string[];
    amountIn: string | null;
    amountOut: string | null;
    network: string;
    maxFees?: bigint;
    slipage: number; // this represent 0.5% of slipage
    priceImpact: number; // this represent 2% of allowed price impact (default)
    deadline?: number;
}

export interface AddLiquidityOptions {
    max?: boolean
    slipage?: number
    deadline?: number
    tokenId?: number
}

export interface WithdrawLiquidityOptions {
    slipage?: number
    deadline?: number
    percent?: number
    tokenId?: number
}

export interface SwapOptions {
    slipage?: number
    deadline?: number
}

export interface MintOptions {
    deadline?: number
}

export interface AddOptions {
    deadline?: number
}

export interface RemoveOptions {
    deadline?: number
}

