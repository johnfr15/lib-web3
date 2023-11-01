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
    percent?: number
    max?: boolean
    slipage?: number
    deadline?: number
    fee?: Fees
    tokenId?: number
}

export type RemoveOptions = {
    slipage?: number
    deadline?: number
    percent?: number
    fee?: Fees
    tokenId?: number
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
}

export type ApproveTx = {
    signer: Wallet
    Erc20: Contract
    token: Token
    chain: Chains
    spender: string
    amount: bigint
}
