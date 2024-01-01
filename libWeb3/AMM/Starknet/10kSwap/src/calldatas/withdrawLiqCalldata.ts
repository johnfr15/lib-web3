import { ethers } from "ethers";
import { Fetcher, Token, Pair } from "l0k_swap-sdk";
import { Account, Contract, uint256 } from "starknet";
import { get_balance, get_token, sort_tokens_2 } from "../utils";
import { RemoveLiquidityTx, RemoveLiquidityCallData } from "../../types";
import { ERC20_ABI, ROUTER_ADDRESSES, TICKER } from "../../config/constants";


export const get_remove_calldata = async(
    signer: Account, 
    tokenA: string, 
    tokenB: string, 
    percent: number, 
    slipage: number, 
    network: 'TESTNET' | 'MAINNET',
    deadline: number,
): Promise<RemoveLiquidityCallData> => {

    try {
        
        const token_a = await get_token( tokenA, network, signer )
        const token_b = await get_token( tokenB, network, signer )
        
        const { token0, token1 } = sort_tokens_2( token_a, token_b )
        const pool = await Fetcher.fetchPairData( token0, token1 )
        
        const tx: RemoveLiquidityTx = await get_removeLiq_tx( signer, token0, token1, pool, percent, slipage, network, deadline )
        
        return {
            removeLiquidityTx: tx,
            utils: { token0, token1, pool },
        }

    } catch (error: any) {
        
        throw error

    }
}

const get_removeLiq_tx = async(
    signer: Account, 
    token0: Token, 
    token1: Token,
    pool: Pair,
    percent: number, 
    slipage: number, 
    network: 'TESTNET' | 'MAINNET',
    deadline: number,
): Promise<RemoveLiquidityTx> => {

    try {

        const Lp = new Contract( ERC20_ABI, pool.liquidityToken.address, signer )

        const reserve0: bigint = ethers.parseUnits( pool.reserve0.toExact(), token0.decimals )
        const reserve1: bigint = ethers.parseUnits( pool.reserve1.toExact(), token1.decimals )
        const { totalSupply } = await Lp.functions.totalSupply()
        const reserveLp = uint256.uint256ToBN( totalSupply )
        const balanceLp = await get_balance( signer.address, Lp.address, signer )

        if ( balanceLp.bigint === BigInt( 0 ) )
            throw(`Error: You don't have any tokens in that pool ${ TICKER[ token0.address ] }/${ TICKER[ token1.address ] }`)

        const liquidity: bigint    = balanceLp.bigint * BigInt( percent * 100 ) / BigInt( 100 * 100 )
        const amount_0_min: bigint = (reserve0 * liquidity / reserveLp) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        const amount_1_min: bigint = (reserve1 * liquidity / reserveLp) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        const tx: RemoveLiquidityTx = {
            contractAddress: ROUTER_ADDRESSES[ network ],
            entrypoint: "removeLiquidity",
            calldata: [
                token0.address,
                token1.address,
                uint256.bnToUint256( liquidity ),
                uint256.bnToUint256( amount_0_min ),
                uint256.bnToUint256( amount_1_min ),
                signer.address,
                deadline
            ],
        } 
        
        return tx

    } catch (error) {
        
        throw error

    }
}