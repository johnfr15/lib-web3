import { Contract, Wallet } from "ethers"
import { Pool, Chains, Token } from "."
import { Liquidity } from "./add"

export type RemoveLiquidityTx = {
    signer: Wallet
    pool: Pool
    lp: Token
    token0: Token
    token1: Token
    position: Liquidity
    liquidity: bigint
    amount0: bigint
    amount1: bigint
    amountXMin: bigint
    amountYMin: bigint
    deadline: number
    percent: number
    chain: Chains
    NftManager: Contract
}

export type DecreaseLiquidity = {
    lid: number // id of nft
    liquidDelta: bigint // amount of liqudity to decrease
    amountXMin: bigint // min amount of tokenX user want to withdraw
    amountYMin: bigint // min amount of tokenY user want to withdraw
    deadline: number // deadline timestamp of transaction
}

export type Collect = {
    recipient: string, // address to receive token
    lid: number, // id of nft
    amountXLim: string, // amount limit of tokenX to collect
    amountYLim: string, // amount limit of tokenY to collect
}