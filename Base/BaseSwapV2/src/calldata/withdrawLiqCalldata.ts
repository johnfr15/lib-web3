import { Wallet, Contract } from "ethers";
import { get_amounts } from "../utils/remove";
import { Pool, Token, Balance } from "../../types";
import { RemoveOptions } from "../../types/remove";
import { RemoveLiquidityTx } from "../../types/remove";
import { get_balance, get_pool, get_token, sort_tokens } from "../utils";
import { CHAIN_ID, CONTRACTS, ROUTER_ABI } from "../../config/constants";


export const get_remove_tx = async(
    signer: Wallet, 
    tokenX: string, 
    tokenY: string, 
    options: RemoveOptions
): Promise<RemoveLiquidityTx> => {
        
    const token_a: Token = await get_token( tokenX )
    const token_b: Token = await get_token( tokenY )

    const { token0, token1 } = sort_tokens( token_a, token_b, '0', '0' )
    const pool: Pool         = await get_pool( token0, token1, signer, options )

    const removeTx: RemoveLiquidityTx = await get_removeLiq( signer, pool, options )

    return removeTx
}





const get_removeLiq = async(
    signer: Wallet, 
    pool: Pool,
    options: RemoveOptions
): Promise<RemoveLiquidityTx> => {

    const { percent, slipage, deadline } = options
    const Router = new Contract( CONTRACTS.ROUTER, ROUTER_ABI, signer )
    
    const liq_balance: Balance = await get_balance( pool.poolAddress, signer )

    if ( liq_balance.bigint === BigInt( 0 ) )
        throw( `Error: You don't have any liquidity in this position.`)

    const [ amountX, amountY, liquidity ] = await get_amounts( pool, liq_balance, options )

    const amountXMin = amountX * BigInt( 100 * (100 - slipage!) ) / BigInt( 100 * 100 )
    const amountYMin = amountY * BigInt( 100 * (100 - slipage!) ) / BigInt( 100 * 100 )


    const removeLiq: RemoveLiquidityTx = {
        signer: signer,
        pool: pool,
        lp: { chainId: CHAIN_ID[ 'base' ], address: pool.poolAddress, decimals: liq_balance.decimals, symbol: "BSWAP-LP", name: "BaseSwap LP", logoURI: "" },
        balanceLp: liq_balance,
        tokenX: pool.tokenX,
        tokenY: pool.tokenY,
        liquidity: liquidity,
        amountX: amountX,
        amountY: amountY,
        amountXMin: amountXMin,
        amountYMin: amountYMin,
        deadline: deadline!,
        percent: percent!,
        Router: Router
    } 
    
    return removeLiq
}