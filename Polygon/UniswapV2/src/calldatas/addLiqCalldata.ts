import { Token } from "@uniswap/sdk-core";
import { AddLiquidityTx } from "../../types";
import { Pair, TokenAmount } from "@uniswap/sdk";
import { ethers, Wallet, Contract } from "ethers";
import { get_token, get_balance, is_balance, is_native } from "../utils";
import { TICKER, ROUTER_ADDRESS, TOKENS, ZERO_ADDRESS, WMATIC } from "../../config/constants";



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
): Promise<AddLiquidityTx> => {

    let addTx: AddLiquidityTx;

    try {

        const token_a: Token     = await get_token( addressA, network )
        const token_b: Token     = await get_token( addressB, network )
        const [ token0, token1 ] = token_a.sortsBefore( token_b ) ? [ token_a, token_b ] : [ token_b, token_a ]


        if ( await is_balance( signer, addressA, addressB ) === 0 )
            throw new Error(`balance is empty for token ${TICKER[addressA]} or ${TICKER[addressB]} or both.`)

        if ( max )
        {
            addTx = await get_max_liq( signer, pool, slipage, deadline, network )
        }
        else
        {
            let addr: string = amountA ? addressA : addressB
            if ( BigInt( addr ) == BigInt( ZERO_ADDRESS ) )
                addr = WMATIC[ network ]

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
    pool: Pair,
    slipage: number,
    deadline: number | null | undefined,
    network: 'TESTNET' | 'MAINNET',
): Promise<AddLiquidityTx> => {

    const { token0, token1 } = pool

    try {

        const Router = new Contract( ROUTER_ADDRESS, ROUTER_ABI, signer )

        const balanceA = await get_balance( is_native( token0.address ) ? ZERO_ADDRESS : token0.address, signer )
        const balanceB = await get_balance( is_native( token1.address ) ? ZERO_ADDRESS : token1.address, signer )

        const reserve_a: bigint = ethers.parseUnits( pool.reserveOf( token0 ).toSignificant(2), token0.decimals )
        const reserve_b: bigint = ethers.parseUnits( pool.reserveOf( token1 ).toSignificant(2), token1.decimals )

        const { amountB: quote_a } = await Router.quote( balanceB.bigint, reserve_b, reserve_a )
        const { amountB: quote_b } = await Router.quote( balanceA.bigint, reserve_a, reserve_b )


        /**
         * @dev If the amount of token B we can buy is bigger than our actual balance of token B that means
         *      that token B is our max token to add
         */
        const b_is_min_balance: boolean = quote_b > balanceB.bigint

        let balance_a: bigint     = b_is_min_balance ? ethers.parseUnits( quote_a, balanceA.decimals ) : balanceA.bigint
        let balance_b: bigint     = b_is_min_balance ? balanceB.bigint : ethers.parseUnits( quote_b, balanceB.decimals )
        let balance_a_min: bigint = balance_a * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        let balance_b_min: bigint = balance_b * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        
        return {
            signer: signer,
            pool: pool,
            tokenA: pool.token0,
            tokenB: pool.token1,
            amountADesired: balance_a,
            amountBDesired: balance_b,
            amountAMin: balance_a_min,
            amountBMin: balance_b_min,
            to: signer.address,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
            network: network,
            Router: Router
        }

    } catch (error: any) {

        throw error
        
    }
}

const get_liq = async(
    signer: Wallet, 
    pool: Pair, 
    addr: string, 
    amount: string, 
    slipage: number, 
    deadline: number | null | undefined,
    network: 'TESTNET' | 'MAINNET',
): Promise<AddLiquidityTx> => {

    const { token0, token1 } = pool
    const Router = new Contract( ROUTER_ADDRESS, ROUTER_ABI, signer )

    try {
        
        const token_a: Token    = token0.address === addr ? token0 : token1
        const token_b: Token    = token0.address !== addr ? token0 : token1

        const balance_a = await get_balance( token_a.address === TOKENS[network].weth ? ZERO_ADDRESS : token_a.address, signer )
        const balance_b = await get_balance( token_b.address === TOKENS[network].weth ? ZERO_ADDRESS : token_b.address, signer )

        const amount_a: bigint = ethers.parseUnits( amount, token_a.decimals )
        const amount_b: bigint = ethers.parseUnits( pool.getOutputAmount( new TokenAmount(token_a, amount_a) )[0].toExact(), token_b.decimals )
        
        const amount_1_min: bigint = amount_a * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        const amount_2_min: bigint = amount_b * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        if ( amount_a > balance_a.bigint )
            throw new Error(`${ TICKER[ token_a.address ] }: Unsufficient balance.`)
        if ( amount_b > balance_b.bigint )
            throw new Error(`${ TICKER[ token_b.address ] }: Unsufficient balance.\nNeeded ${ ethers.formatUnits(amount_b, token_b.decimals) } but got ${ balance_b.string }`)


        return {
            signer: signer,
            pool: pool,
            tokenA: token_a,
            tokenB: token_b,
            amountADesired: amount_a,
            amountBDesired: amount_b,
            amountAMin: amount_1_min,
            amountBMin: amount_2_min,
            to: signer.address,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
            network: network,
            Router: Router,
        }

    } catch(error) {

        throw error

    }
}