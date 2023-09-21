import { ethers, Wallet, Contract, N } from "ethers";
import { TICKER, ROUTER_ABI, ROUTER_ADDRESS, ZERO_ADDRESS, TOKENS } from "../config/constants";
import { AddLiquidity, Pool, Token } from "../types";
import { get_token, get_balance, get_pool, sort_tokens, is_balance, get_quote, is_native } from "../utils";


export const get_add_liq_tx = async(
    signer: Wallet, 
    addressA: string,
    amountA: string | null,
    addressB: string,
    amountB: string | null,
    max: boolean,
    network: 'TESTNET' | 'MAINNET',
    slipage: number,
): Promise<AddLiquidity> => {

    let addTx: AddLiquidity;
    
    try {

        const token_a: Token     = await get_token( addressA, network, signer )
        const token_b: Token     = await get_token( addressB, network, signer )
        const { token0, token1 } = sort_tokens( token_a, token_b, amountA, amountB )

        const pool: Pool = await get_pool( token0, token1, network, signer )


        if ( await is_balance( signer, addressA, addressB ) === 0 )
            throw new Error(`balance is empty for token ${TICKER[addressA]} or ${TICKER[addressB]} or both.`)

        if ( max )
        {
            addTx = await get_max_liq( signer, addressA, addressB, pool, network)
        }
        else
        {
            let addr: string = amountA ? addressA : addressB
            let amount: string = amountA ? amountA : amountB!
            addTx = await get_liq( signer, pool, addr, amount, network )
        }

        return addTx

    } catch (error: any) {
        
        throw error

    }
}

const get_max_liq = async(
    signer: Wallet,
    addressA: string,
    addressB: string, 
    pool: Pool,
    network: 'TESTNET' | 'MAINNET',
): Promise<AddLiquidity> => {

    let value: bigint | undefined

    try {

        const balanceA = await get_balance( pool.tokenA.address === TOKENS[network].weth ? ZERO_ADDRESS : pool.tokenA.address, signer )
        const balanceB = await get_balance( pool.tokenB.address === TOKENS[network].weth ? ZERO_ADDRESS : pool.tokenB.address, signer )

        const quoteB = get_quote( balanceA.string, pool.tokenA, pool.tokenB, pool )
        const quoteA = get_quote( balanceB.string, pool.tokenB, pool.tokenA, pool )



        /*
         * @dev If the amount of token B we can buy is bigger than our actual balance of token B that means
         *      that token B is our max token to add
         */
        const b_is_min_balance: boolean = ethers.parseUnits( quoteB, balanceB.decimals ) > balanceB.bigint

        let balance_a: bigint = b_is_min_balance ? ethers.parseUnits( quoteA, balanceA.decimals ) : balanceA.bigint
        let balance_b: bigint = b_is_min_balance ? balanceB.bigint : ethers.parseUnits( quoteB, balanceB.decimals )


        const inputs = [
            { token: pool.tokenA.address === TOKENS[network].weth ? ZERO_ADDRESS : pool.tokenA.address, amount: balance_a },
            { token: pool.tokenB.address === TOKENS[network].weth ? ZERO_ADDRESS : pool.tokenB.address, amount: balance_b },
        ]

        if ( is_native( addressA ) || is_native( addressB ) )
            value = is_native( pool.tokenA.address === TOKENS[network].weth ? ZERO_ADDRESS : pool.tokenA.address ) ? balance_a : balance_b
        

        return {
            pool: pool.pair,
            inputs: inputs,
            data: signer.address,
            minLiquidity: BigInt( 1 ),
            callback: ZERO_ADDRESS,
            callbackData: "0x",
            tokenA: pool.tokenA,
            tokenB: pool.tokenB,
            value: value,
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
    network: 'TESTNET' | 'MAINNET',
): Promise<AddLiquidity> => {

    let value: bigint | undefined

    try {
        
        const token_1: Token = pool.tokenA.address === addr ? pool.tokenA : pool.tokenB
        const token_2: Token = pool.tokenA.address !== addr ? pool.tokenA : pool.tokenB

        const balance_1 = await get_balance( token_1.address, signer )
        const balance_2 = await get_balance( token_2.address, signer )

        const amount_1: bigint = ethers.parseUnits( amount, token_1.decimals )
        const amount_2: bigint = ethers.parseUnits( get_quote( amount, token_1, token_2, pool ), token_2.decimals)


        if ( amount_1 > balance_1.bigint )
            throw new Error(`${ TICKER[ token_1.address ] }: Unsufficient balance.`)
        if ( amount_2 > balance_2.bigint )
            throw new Error(`${ TICKER[ token_2.address ] }: Unsufficient balance.\nNeeded ${ ethers.formatUnits(amount_2, token_2.decimals) } but got ${ balance_2.string }`)

        const inputs = [
            { token: token_1.address, amount: amount_1 },
            { token: token_2.address, amount: amount_2 },
        ]

        if ( is_native( addr ) || BigInt( token_2.address) === BigInt( TOKENS[ network ].weth ) )
            value = is_native( addr ) ? amount_1 : amount_2

        return {
            pool: pool.pair,
            inputs: inputs,
            data: signer.address,
            minLiquidity: BigInt( 0 ),
            callback: ZERO_ADDRESS,
            callbackData: "0x",
            tokenA: pool.tokenA,
            tokenB: pool.tokenB,
            value: value,
            network: network
        }

    } catch(error) {

        throw error

    }
}

export const get_min_liquidity = async( addTx: AddLiquidity, Router: Contract ): Promise<bigint> => {

    const { pool, inputs, data, minLiquidity, callback, callbackData, value } = addTx

    try {
        
        const min = await Router.addLiquidity.staticCall(
            pool,
            inputs,
            data,
            minLiquidity,
            callback,
            callbackData,
            { value: value }
        )

        return min

    } catch (error) {
        
        throw( error )
    }
}