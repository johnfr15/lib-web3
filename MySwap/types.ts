import { Calldata, Uint256 } from "starknet"

export type Add_liquidity_args = {
    token_a_addr: string,
    token_a_decimals: number,
    amount_a: bigint,
    amount_a_min: bigint,
    token_b_addr: string,
    token_b_decimals: number,
    amount_b: bigint,
    amount_b_min: bigint
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