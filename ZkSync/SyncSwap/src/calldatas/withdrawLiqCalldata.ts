import { Wallet, Contract, ethers } from "ethers";
import { get_balance, get_pool, get_token, sort_tokens } from "../utils";
import { Pool, RemoveLiquidity, Token, WithdrawMode } from "../../types";
import { CLASSIC_POOL_ABI, TICKER, ZERO_ADDRESS } from "../../config/constants";


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
        
        const token_a: Token     = await get_token( tokenA, network )
        const token_b: Token     = await get_token( tokenB, network )
        const { token0, token1 } = sort_tokens( token_a, token_b, '0', '0' )
        
        const pool: Pool = await get_pool( token0, token1, network, signer )
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

        const Pool              = new Contract( pool.pair, CLASSIC_POOL_ABI, signer )
        const reserveLp: bigint = await Pool.totalSupply()
        const balanceLp         = await get_balance( pool.pair, signer )

        const liquidity: bigint    = balanceLp.bigint * BigInt( percent * 100 ) / BigInt( 100 * 100 )
        const amount_0_min: bigint = ( pool.reserveA * liquidity / reserveLp ) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        const amount_1_min: bigint = ( pool.reserveB * liquidity / reserveLp ) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        const withdraw_mode = WithdrawMode.WITHDRAW_AND_UNWRAP_TO_NATIVE_ETH


        const removeLiq: RemoveLiquidity = {
            pool: pool.pair,
            liquidity: liquidity,
            data: ethers.AbiCoder.defaultAbiCoder().encode( ["address", "uint8"], [ signer.address, withdraw_mode ]),
            minLiquidities: [ amount_0_min, amount_1_min ],
            callback: ZERO_ADDRESS,
            callbackData: "0x",
            tokenA: pool.tokenA,
            tokenB: pool.tokenB,
            balanceLp: balanceLp,
            percent: percent,
            network: network
        } 
        
        return removeLiq

    } catch (error) {
        
        throw error

    }
}