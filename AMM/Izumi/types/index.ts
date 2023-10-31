import { Contract, Wallet } from "ethers"

export type Token = {
    chainId: number
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI: string
}

export type Balance = {
    bigint: bigint
    string: string,
    decimals: number
}

export type Pool = {
    tokenX: Token
    tokenY: Token
    pairAddress: string
    fees: number
    state: State
    point: Point
    Quoter: Contract
    Pool: Contract
}

export enum Fees {
    LOW = 400,      // 0.04%
    MEDIUM = 2000,  // 0.2%
    BIG = 10000     // 1%
}

export type AddOptions = {
    max?: boolean
    slipage?: number
    deadline?: number
}

export type RemoveOptions = {
    slipage?: number
    deadline?: number
    percent?: number
}

export type State = {
    sqrtPrice_96: bigint
    currentPoint: bigint
    observationCurrentIndex: bigint
    observationQueueLen: bigint
    observationNextQueueLen: bigint
    locked: boolean
    liquidity: bigint
    liquidityX: bigint
}

export type Point = {
    liquidSum: bigint
    liquidDelta: bigint
    accFeeXOut_128: bigint
    accFeeYOut_128: bigint
    isEndpt: boolean
}

export type Chains =
  | 'bsc'
  | 'aurora'
  | 'arbitrum'
  | 'polygon'
  | 'meter'
  | 'zksync'
  | 'ontology'
  | 'mantle'
  | 'linea'
  | 'ethereumClassic'
  | 'base'
  | 'opbnb'
  | 'kroma'
  | 'manta'
  | 'scroll'
  | 'bscTestnet'
  | 'zksyncTestnet'
  | 'scrollTestnet'
  | 'mantleTestnet'
  | 'lineaTestnet';

export type ChainConfig = {
    [key in Chains]: {
        factory: string;
        swapX2YModule: string;
        swapY2XModule: string;
        liquidityModule: string;
        limitOrderModule: string;
        flashModule: string;
        periphery: {
            quoterWithoutLimit: string;
            quoterWith10000Ticks: string;
            swap: string;
            liquidityManager: string;
            limitOrderManager: string;
            box?: string;
            tapProxy?: string;
        };
    };
};
export type ApproveTx = {
    signer: Wallet
    Erc20: Contract
    token: Token
    chain: Chains
    spender: string
    amount: bigint
}



export type AddLiquidityTx = {
    signer: Wallet
    pool: Pool
    tokenA: Token
    tokenB: Token
    fee: Fees
    tokenId: number | undefined
    tickLower: number
    tickUpper: number
    amountADesired: bigint
    amountBDesired: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
    chain: Chains
    NftManager: Contract
}

export type RemoveLiquidityTx = {
    signer: Wallet
    pool: Pool
    lp: Token
    token0: Token
    token1: Token
    position: State
    liquidity: bigint
    amount0: bigint
    amount1: bigint
    amount0Min: bigint
    amount1Min: bigint
    deadline: number
    percent: number
    chain: Chains
    NftManager: Contract
}


export type Mint = {
    token0: string
    token1: string
    fee: number
    tickLower: number
    tickUpper: number
    amount0Desired: bigint
    amount1Desired: bigint
    amount0Min: bigint
    amount1Min: bigint
    recipient: string
    deadline: number
}

export type IncreaseLiquidity = {
    tokenId: number
    amount0Desired: bigint
    amount1Desired: bigint
    amount0Min: bigint
    amount1Min: bigint
    deadline: number
}

export type DecreaseLiquidity = {
    tokenId: bigint
    liquidity: bigint
    amount0Min: bigint
    amount1Min: bigint
    deadline: bigint
}


