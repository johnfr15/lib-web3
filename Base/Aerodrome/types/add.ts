import { Contract, Wallet } from "ethers"
import { Pool, Token } from "."


// infomation of liquidity provided by miner
export type Liquidity = {
    // left point of liquidity-token, the range is [leftPt, rightPt)
    leftPt: number
    // right point of liquidity-token, the range is [leftPt, rightPt)
    rightPt: number
    // amount of liquidity on each point in [leftPt, rightPt)
    liquidity: bigint
    // a 128-fixpoint number, as integral of { fee(pt, t)/L(pt, t) }. 
    // here fee(pt, t) denotes fee generated on point pt at time t
    // L(pt, t) denotes liquidity on point pt at time t
    // pt varies in [leftPt, rightPt)
    // t moves from pool created until miner last modify this liquidity-token (mint/addLiquidity/decreaseLiquidity/create)
    lastFeeScaleX_128: bigint
    lastFeeScaleY_128: bigint
    // remained tokenX miner can collect, including fee and withdrawed token
    remainTokenX: bigint
    remainTokenY: bigint
    // id of pool in which this liquidity is added
    poolId: number
    tokenId: number
}

export type PoolMeta = {
    tokenX: string
    tokenY: string
    fee: number
}

/// parameters when calling mint, grouped together to avoid stake too deep
export type MintParam = {
    // miner address
    miner: string
    // tokenX of swap pool
    tokenX: string
    // tokenY of swap pool
    tokenY: string
    // fee amount of swap pool
    fee: number
    // left point of added liquidity
    pl: number
    // right point of added liquidity
    pr: number
    // amount limit of tokenX miner willing to deposit
    xLim: bigint
    // amount limit tokenY miner willing to deposit
    yLim: bigint
    // minimum amount of tokenX miner willing to deposit
    amountXMin: bigint
    // minimum amount of tokenY miner willing to deposit
    amountYMin: bigint
    deadline: number
}

/// parameters when calling addLiquidity, grouped together to avoid stake too deep
export type AddLiquidityParam = {
    // id of nft
    lid: number
    // amount limit of tokenX user willing to deposit
    xLim: bigint
    // amount limit of tokenY user willing to deposit
    yLim: bigint
    // min amount of tokenX user willing to deposit
    amountXMin: bigint
    // min amount of tokenY user willing to deposit
    amountYMin: bigint
    deadline: number
}

export type AddLiquidityTx = {
    signer: Wallet
    pool: Pool
    tokenX: Token
    tokenY: Token
    liquidity: Liquidity | undefined
    pl: number
    pr: number
    amountADesired: bigint
    amountBDesired: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
    NftManager: Contract
}