import { ethers } from "ethers";
import { Account, Contract, uint256, Uint256 } from "starknet"
import { TICKER, MUTE_ROUTER_ABI, ROUTER_ADDRESS } from "../constant";
import { AddLiquidityCallData, AddLiquidityTx, Pool } from "../types";
import { get_token, get_balance, sort_tokens, get_pool, Uint256_to_string } from "../utils";
import { Fraction, Token } from "l0k_swap-sdk";



export const get_add_liq_calldata = async(
    signer: Account, 
    addressA: string,
    amountA: string | null,
    addressB: string,
    amountB: string | null,
    max: boolean,
    network: 'TESTNET' | 'MAINNET',
    slipage: number,
    deadline: number,
): Promise<AddLiquidityCallData> => {

    let add_liq_tx: AddLiquidityTx;
    
    try {

        const token_a: Token = await get_token( addressA, network, signer )
        const token_b: Token = await get_token( addressB, network, signer )
        const { token0, token1 } = sort_tokens( token_a, token_b, amountA, amountB )

        const pool: Pool  = await get_pool( token0, token1, network, signer )

        if ( max )
        {
            add_liq_tx = await get_max_liq( signer, pool, network, slipage, deadline )
        }
        else
        {
            let addr: string = amountA ? addressA : addressB
            let amount: string = amountA ? amountA : amountB!
            add_liq_tx = await get_liq( signer, pool, addr, amount, network, slipage, deadline )
        }

        const add_liq_callData: AddLiquidityCallData = {
            addLiquidityTx: add_liq_tx,
            utils: { tokenA: token_a, tokenB: token_b, pool: pool }
        } 

        return add_liq_callData

    } catch (error: any) {
        
        throw error

    }
}

const get_max_liq = async(
    signer: Account, 
    pool: Pool,
    network: string,
    slipage: number,
    deadline: number,
): Promise<AddLiquidityTx> => {

    try {
        const Router = new Contract( MUTE_ROUTER_ABI, ROUTER_ADDRESS[ network ], signer )

        const balanceA = await get_balance( signer.address, pool.token0.address, signer )
        const balanceB = await get_balance( signer.address, pool.token1.address, signer )

        const { amountB: quoteB } = await Router.functions.quote( balanceA.uint256, pool.reserve0, pool.reserve1 )
        const { amountB: quoteA } = await Router.functions.quote( balanceB.uint256, pool.reserve1, pool.reserve0 )

        /**
         * @dev If the amount of token B we can buy is bigger than our actual balance of token B that means
         *      that token B is our max token to add
         */
        const b_is_min_balance: boolean = uint256.uint256ToBN( quoteB ) > balanceB.bigint

        let balance_a: bigint     = b_is_min_balance ? uint256.uint256ToBN( quoteA ) : balanceA.bigint;
        let balance_b: bigint     = b_is_min_balance ? balanceB.bigint : uint256.uint256ToBN( quoteB );
        let balance_a_min: bigint = balance_a * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        let balance_b_min: bigint = balance_b * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        return {
            contractAddress: Router.address,
            entrypoint: "add_liquidity",
            calldata: [
                pool.token0.address,
                pool.token1.address,
                uint256.bnToUint256( balance_a ),
                uint256.bnToUint256( balance_b ),
                uint256.bnToUint256( balance_a_min ),
                uint256.bnToUint256( balance_b_min ),
                signer.address,
                deadline
            ]
        }

    } catch (error: any) {

        throw error
        
    }
}

const get_liq = async(
    signer: Account, 
    pool: Pool, 
    addr: string, 
    amount: string, 
    network: string, 
    slipage: number, 
    deadline: number
): Promise<AddLiquidityTx> => {

    try {
        
        const Router = new Contract( MUTE_ROUTER_ABI, ROUTER_ADDRESS[ network ], signer )
        
        const token_1: Token     = pool.token0.address === addr ? pool.token0 : pool.token1
        const token_2: Token     = pool.token0.address !== addr ? pool.token0 : pool.token1
        const reserve_1: Uint256 = pool.token0.address === addr ? pool.reserve0 : pool.reserve1
        const reserve_2: Uint256 = pool.token0.address !== addr ? pool.reserve0 : pool.reserve1

        const balance_1 = await get_balance(signer.address, token_1.address, signer)
        const balance_2 = await get_balance(signer.address, token_2.address, signer)

        const amount_1: bigint = ethers.parseUnits( amount, token_1.decimals )
        const { amountB } =  await Router.functions.quote( uint256.bnToUint256( amount_1 ), reserve_1, reserve_2 )
        const amount_2: bigint = uint256.uint256ToBN( amountB )
        
        const amount_1_min: bigint = amount_1 * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        const amount_2_min: bigint = amount_2 * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        if ( amount_1 > balance_1.bigint )
            throw new Error(`${ TICKER[ token_1.address ] }: Unsufficient balance.`)
        if ( amount_2 > balance_2.bigint )
            throw new Error(`${ TICKER[ token_2.address ] }: Unsufficient balance.\nNeeded ${ ethers.formatUnits(amount_2, token_2.decimals) } but got ${ balance_2.string }`)

        return {
            contractAddress: Router.address,
            entrypoint: "add_liquidity",
            calldata: [
                token_1.address,
                token_2.address,
                uint256.bnToUint256( amount_1 ),
                uint256.bnToUint256( amount_2 ),
                uint256.bnToUint256( amount_1_min ),
                uint256.bnToUint256( amount_2_min ),
                signer.address,
                deadline
            ]
        }

    } catch(error) {

        throw error

    }
}