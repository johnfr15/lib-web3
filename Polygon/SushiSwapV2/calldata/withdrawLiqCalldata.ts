import { Wallet, Contract} from "ethers";
import { V2_PAIR_ABI, TICKER } from "../config/constants";
import { get_balance, get_pool, get_token, sort_tokens } from "../utils";
import { Pool, RemoveLiquidityTx, Token } from "../types";


export const get_remove_tx = async(
    signer: Wallet, 
    tokenA: string, 
    tokenB: string, 
    percent: number, 
    slipage: number, 
    network: 'TESTNET' | 'MAINNET',
    deadline: number | null,
): Promise<RemoveLiquidityTx> => {

    try {
        
        const token_a: Token     = await get_token( tokenA, network )
        const token_b: Token     = await get_token( tokenB, network )
        const { token0, token1 } = sort_tokens( token_a, token_b, '0', '0' )
        const pool: Pool         = await get_pool( token0, token1, signer )

        const removeTx: RemoveLiquidityTx = await get_removeLiq( signer, network, pool, percent, slipage, deadline )

        if ( removeTx.balanceLp.bigint === BigInt( 0 ) )
            throw(`Error: You don't have any LP token for pool ${ TICKER[ tokenA ] }/${ TICKER[ tokenB ] }`)

        
        return removeTx

    } catch (error: any) {
        
        throw error

    }
}

const get_removeLiq = async(
    signer: Wallet, 
    network: 'TESTNET' | 'MAINNET',
    pool: Pool,
    percent: number, 
    slipage: number, 
    deadline: number | null,
): Promise<RemoveLiquidityTx> => {

    try {

        const Pool              = new Contract( pool.pair, V2_PAIR_ABI, signer )
        const reserveLp: bigint = await Pool.totalSupply()
        const balanceLp         = await get_balance( pool.pair, signer )

        const liquidity: bigint    = balanceLp.bigint * BigInt( percent * 100 ) / BigInt( 100 * 100 )
        const amount_0_min: bigint = ( pool.reserveA * liquidity / reserveLp ) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        const amount_1_min: bigint = ( pool.reserveB * liquidity / reserveLp ) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        const removeLiq: RemoveLiquidityTx = {
            signer: signer,
            pool: pool,
            tokenA: pool.tokenA,
            tokenB: pool.tokenB,
            lp: pool.pair,
            balanceLp: balanceLp,
            liquidity: liquidity,
            amountAMin: amount_0_min,
            amountBMin: amount_1_min,
            to: signer.address,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20,  // 20 minutes from the current Unix time
            percent: percent,
            network: network
        } 
        
        return removeLiq

    } catch (error) {
        
        throw error

    }
}