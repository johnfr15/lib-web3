import { RemoveLiquidityTx } from "../../types";
import { ethers, Wallet, Contract} from "ethers";
import { get_balance, get_token } from "../utils";
import { Token, Pair, Fetcher } from "@uniswap/sdk";
import { ERC20_ABI, ROUTER_ABI, ROUTER_ADDRESS, TICKER } from "../../config/constants";


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
        
        const token_a: Token = await get_token( tokenA, network )
        const token_b: Token = await get_token( tokenB, network )
        const pool: Pair     = await Fetcher.fetchPairData( token_a, token_b )

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
    pool: Pair,
    percent: number, 
    slipage: number, 
    deadline: number | null,
): Promise<RemoveLiquidityTx> => {

    try {

        const Lp     = new Contract( pool.liquidityToken.address, ERC20_ABI, signer )
        const Router = new Contract( ROUTER_ADDRESS[ network ], ROUTER_ABI, signer )

        const reserveLp: bigint = await Lp.totalSupply()
        const balanceLp         = await get_balance( pool.liquidityToken.address, signer )

        const liquidity: bigint    = balanceLp.bigint * BigInt( percent * 100 ) / BigInt( 100 * 100 ) // Apply the percentage of LP we want to burn
        const reserveA: bigint     = ethers.parseUnits( pool.reserve0.toExact(), pool.token0.decimals )
        const reserveB: bigint     = ethers.parseUnits( pool.reserve1.toExact(), pool.token1.decimals )
        const amount_0_min: bigint = ( reserveA * liquidity / reserveLp ) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        const amount_1_min: bigint = ( reserveB * liquidity / reserveLp ) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        const removeLiq: RemoveLiquidityTx = {
            signer: signer,
            pool: pool,
            balanceLp: balanceLp,
            liquidity: liquidity,
            amountAMin: amount_0_min,
            amountBMin: amount_1_min,
            to: signer.address,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20,  // 20 minutes from the current Unix time
            stable: false,
            percent: percent,
            network: network,
            Router: Router
        } 
        
        return removeLiq

    } catch (error) {
        
        throw error

    }
}