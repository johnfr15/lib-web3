import { Calldata, Uint256 } from "starknet"

export type AddLiquidityArgs = {
    token_a_addr: string,
    token_a_decimals: number,
    amount_a: Uint256,
    amount_a_min: Uint256,
    token_b_addr: string,
    token_b_decimals: number,
    amount_b: Uint256,
    amount_b_min: Uint256
}

export type ApproveCallData = {
    contractAddress: string,
    entrypoint: string,
    calldata: Calldata | [string, Uint256] 
}

export type SwapCallData = {
    contractAddress: string,
    entrypoint: string,
    calldata: Calldata | [number, string, Uint256, Uint256]
}

export type AddLiquidityCallData = {
    contractAddress: string,
    entrypoint: string,
    calldata: Calldata | Array<AddLiquidityArgs[keyof AddLiquidityArgs]>
    utils?: { decimalsA: number, decimalsB: number }
}