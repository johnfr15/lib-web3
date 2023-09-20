import { ethers, Wallet, Contract, TransactionRequest } from "ethers";
import { TICKER, MUTE_ROUTER_ABI, ROUTER_ADDRESS } from "../config/constants";
import { AddLiquidity, Pool, Token } from "../types";
import { get_token, get_balance, get_pool, sort_tokens, is_balance } from "../utils";
import { encode_add_datas } from "../utils/add"
import { addLiquidity } from "../mute";


export const get_add_liq_tx = async(
    signer: Wallet, 
    addressA: string,
    amountA: string | null,
    addressB: string,
    amountB: string | null,
    max: boolean,
    network: 'TESTNET' | 'MAINNET',
    slipage: number,
    deadline: number | null | undefined,
): Promise<AddLiquidity> => {

    let addTx: AddLiquidity;
    
    try {

        const token_a: Token     = await get_token( addressA, network, signer )
        const token_b: Token     = await get_token( addressB, network, signer )
        const { token0, token1 } = sort_tokens( token_a, token_b, amountA, amountB )

        const pool: Pool = await get_pool( token0, token1, network, signer )

        if ( await is_balance(signer, addressA, addressB) === 0 )
            throw new Error(`balance is empty for token ${TICKER[addressA]} or ${TICKER[addressB]} or both.`)

        if ( max )
        {
            addTx = await get_max_liq( signer, pool, slipage, deadline, network )
        }
        else
        {
            let addr: string = amountA ? addressA : addressB
            let amount: string = amountA ? amountA : amountB!
            addTx = await get_liq( signer, pool, addr, amount, slipage, deadline, network )
        }


        return addTx

    } catch (error: any) {
        
        throw error

    }
}

const get_max_liq = async(
    signer: Wallet, 
    pool: Pool,
    slipage: number,
    deadline: number | null | undefined,
    network: 'TESTNET' | 'MAINNET',
): Promise<AddLiquidity> => {

    try {
        const Router = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer )

        const balanceA = await get_balance( pool.tokenA.address, signer )
        const balanceB = await get_balance( pool.tokenB.address, signer )

        const quoteB = await Router.quote( balanceA.bigint, pool.reserveA, pool.reserveB )
        const quoteA = await Router.quote( balanceB.bigint, pool.reserveB, pool.reserveA )

        /*
         * @dev If the amount of token B we can buy is bigger than our actual balance of token B that means
         *      that token B is our max token to add
         */
        const b_is_min_balance: boolean = quoteB  > balanceB.bigint

        let balance_a: bigint     = b_is_min_balance ?  quoteA : balanceA.bigint;
        let balance_b: bigint     = b_is_min_balance ? balanceB.bigint :  quoteB;
        let balance_a_min: bigint = balance_a * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        let balance_b_min: bigint = balance_b * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        return {
            tokenA: pool.tokenA,
            tokenB: pool.tokenB,
            amountADesired: balance_a,
            amountBDesired: balance_b,
            amountAMin: balance_a_min,
            amountBMin: balance_b_min,
            to: signer.address,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
            feeType: 0,
            stable: false,
            network: network
        }

    } catch (error: any) {

        throw error
        
    }
}

const get_liq = async(
    signer: Wallet, 
    pool: Pool, 
    addr: string, 
    amount: string, 
    slipage: number, 
    deadline: number | null | undefined,
    network: 'TESTNET' | 'MAINNET',
): Promise<AddLiquidity> => {

    try {
        
        const Router = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer )
        
        const token_1: Token    = pool.tokenA.address === addr ? pool.tokenA : pool.tokenB
        const token_2: Token    = pool.tokenA.address !== addr ? pool.tokenA : pool.tokenB
        const reserve_1: bigint = pool.tokenA.address === addr ? pool.reserveA : pool.reserveB
        const reserve_2: bigint = pool.tokenA.address !== addr ? pool.reserveA : pool.reserveB

        const balance_1 = await get_balance( token_1.address, signer )
        const balance_2 = await get_balance( token_2.address, signer )

        const amount_1: bigint = ethers.parseUnits( amount, token_1.decimals )
        const amount_2 =  await Router.quote( amount_1, reserve_1, reserve_2 )
        
        const amount_1_min: bigint = amount_1 * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        const amount_2_min: bigint = amount_2 * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        if ( amount_1 > balance_1.bigint )
            throw new Error(`${ TICKER[ token_1.address ] }: Unsufficient balance.`)
        if ( amount_2 > balance_2.bigint )
            throw new Error(`${ TICKER[ token_2.address ] }: Unsufficient balance.\nNeeded ${ ethers.formatUnits(amount_2, token_2.decimals) } but got ${ balance_2.string }`)


        return {
            tokenA: token_1,
            tokenB: token_2,
            amountADesired: amount_1,
            amountBDesired: amount_2,
            amountAMin: amount_1_min,
            amountBMin: amount_2_min,
            to: signer.address,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
            feeType: 0,
            stable: false,
            network: network
        }

    } catch(error) {

        throw error

    }
}