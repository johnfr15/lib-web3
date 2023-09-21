import { Wallet, Contract} from "ethers";
import { MUTE_PAIR_ABI, MUTE_ROUTER_ABI, ROUTER_ADDRESS, TICKER } from "../config/constants";
import { get_balance, get_pool, get_token, sort_tokens } from "../utils";
import { Pool, RemoveLiquidity, Token } from "../types";


export const get_remove_tx = async(
    signer: Wallet, 
    tokenA: string, 
    tokenB: string, 
    percent: number, 
    slipage: number, 
    network: 'TESTNET' | 'MAINNET',
    deadline: number | null,
): Promise<RemoveLiquidity> => {

    try {
        
        const Router = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer )

        const token_a: Token     = await get_token( tokenA, network, signer )
        const token_b: Token     = await get_token( tokenB, network, signer )
        const { token0, token1 } = sort_tokens( token_a, token_b, '0', '0' )
        const pool: Pool         = await get_pool( token0, token1, network, signer )

        const removeTx: RemoveLiquidity = await get_removeLiq( signer, network, pool, percent, slipage, deadline )

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
): Promise<RemoveLiquidity> => {

    try {

        const Pool              = new Contract( pool.pair, MUTE_PAIR_ABI, signer )
        const reserveLp: bigint = await Pool.totalSupply()
        const balanceLp         = await get_balance( pool.pair, signer )

        const liquidity: bigint    = balanceLp.bigint * BigInt( percent * 100 ) / BigInt( 100 * 100 )
        const amount_0_min: bigint = ( pool.reserveA * liquidity / reserveLp ) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        const amount_1_min: bigint = ( pool.reserveB * liquidity / reserveLp ) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        const removeLiq: RemoveLiquidity = {
            tokenA: pool.tokenA,
            tokenB: pool.tokenB,
            lp: pool.pair,
            balanceLp: balanceLp,
            liquidity: liquidity,
            amountAMin: amount_0_min,
            amountBMin: amount_1_min,
            to: signer.address,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20,  // 20 minutes from the current Unix time
            stable: false,
            percent: percent,
            network: network
        } 
        
        return removeLiq

    } catch (error) {
        
        throw error

    }
}