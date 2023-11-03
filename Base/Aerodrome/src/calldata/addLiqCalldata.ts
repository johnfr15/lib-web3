import { ethers, Wallet, Contract } from "ethers";
import { AddOptions, Balance, Pool, Token } from "../../types";
import { get_token, get_balance, get_pool, sort_tokens, get_quote } from "../utils";
import { get_amounts } from "../utils/add"
import { CONTRACTS, ROUTER_ABI } from "../../config/constants";
import { AddLiquidityTx } from "../../types/add";


export const get_add_liq_tx = async(
    signer: Wallet, 
    addressA: string,
    amountA: string | null,
    addressB: string,
    amountB: string | null,
    options: AddOptions
): Promise<AddLiquidityTx> => {

    let addTx: AddLiquidityTx;

    const token_a: Token = await get_token( addressA )
    const token_b: Token = await get_token( addressB )
    const { token0, token1, amount0, amount1 } = sort_tokens( token_a, token_b, amountA, amountB )

    const pool: Pool = await get_pool( token0, token1, signer, options )

    // if ( await is_balance(signer, token_a.address, token_b.address) === 0 )
    //     throw new Error(`balance is empty for token ${ token_a.symbol } or ${ token_b.symbol } or both.`)

    if ( options.max || options.percent )
    {
        addTx = await get_max_liq( signer, pool, options )
    }
    else
    {
        let addr: string = amount0 ? pool.tokenX.address : pool.tokenY.address
        let amount: bigint = amount0 ? amount0 : amount1!
        addTx = await get_liq( signer, pool, addr, amount, options )
    }

    return addTx
}

const get_max_liq = async(
    signer: Wallet, 
    pool: Pool,
    options: AddOptions
): Promise<AddLiquidityTx> => {

    const Router = new Contract( CONTRACTS.Router, ROUTER_ABI, signer )
    
    const balanceX: Balance = await get_balance( pool.tokenX.address, signer )
    const balanceY: Balance = await get_balance( pool.tokenY.address, signer )
    const { amountX, amountY } = get_amounts( balanceX, balanceY, options )
    
    const quote_a = get_quote( ethers.formatUnits( amountX, balanceX.decimals ), pool.tokenX, pool.tokenY, pool )
    const quote_b = get_quote( ethers.formatUnits( amountY, balanceY.decimals ), pool.tokenY, pool.tokenX, pool )

    /*
    * @dev If the amount of token B we can buy is bigger than our actual balance of token B that means
    *      that token B is our max token to add
    */
    const b_is_min_balance: boolean = ethers.parseUnits( quote_a, balanceX.decimals ) > amountY 

    const amountA: bigint = b_is_min_balance ? ethers.parseUnits( quote_b, balanceY.decimals ) : amountX
    const amountB: bigint = b_is_min_balance ? amountY : ethers.parseUnits( quote_a, balanceX.decimals )
    const amountAMin: bigint = amountA * BigInt( 100 * 100 - (options.slipage! * 100) ) / BigInt( 100 * 100 )
    const amountBMin: bigint = amountB * BigInt( 100 * 100 - (options.slipage! * 100) ) / BigInt( 100 * 100 )


    const add_liquidity: AddLiquidityTx = {
        signer: signer,
        pool: pool,
        tokenX: pool.tokenX,
        tokenY: pool.tokenY,
        amountXDesired: amountA,
        amountYDesired: amountB,
        amountXMin: amountAMin,
        amountYMin: amountBMin,
        to: signer.address,
        deadline: options.deadline!,
        Router: Router,
    }

    return add_liquidity 
}

const get_liq = async(
    signer: Wallet, 
    pool: Pool, 
    addr: string, 
    amount: bigint, 
    options: AddOptions
): Promise<AddLiquidityTx> => {

        const Router = new Contract( CONTRACTS.Router, ROUTER_ABI, signer )

        const token_1: Token = BigInt( pool.tokenX.address ) === BigInt( addr ) ? pool.tokenX : pool.tokenY
        const token_2: Token = BigInt( pool.tokenX.address ) !== BigInt( addr ) ? pool.tokenX : pool.tokenY

        const balance_1 = await get_balance( token_1.address, signer )
        const balance_2 = await get_balance( token_2.address, signer )

        const amount_1 = amount
        const amount_2 = ethers.parseUnits( get_quote( ethers.formatUnits( amount_1, token_1.decimals ), token_1, token_2, pool ), token_2.decimals)
        
        const amount_1_min: bigint = amount_1 * BigInt( 100 * 100 - (options.slipage! * 100) ) / BigInt( 100 * 100 )
        const amount_2_min: bigint = amount_2 * BigInt( 100 * 100 - (options.slipage! * 100) ) / BigInt( 100 * 100 )


        // if ( amount_1 > balance_1.bigint )
        //     throw new Error(`${ token_1.symbol }: Unsufficient balance.`)
        // if ( amount_2 > balance_2.bigint )
        //     throw new Error(`${ token_2.symbol }: Unsufficient balance.\nNeeded ${ ethers.formatUnits(amount_2, token_2.decimals) } but got ${ balance_2.string }`)

        const token_1_is_min = BigInt( pool.tokenX.address ) === BigInt( token_1.address )
        const [ tokenX, tokenY ] = token_1_is_min ? [token_1, token_2] : [token_2, token_1]
        const [ amountX, amountY ] = token_1_is_min ? [amount_1, amount_2] : [amount_2, amount_1]
        const [ amountXMin, amountYMin ] = token_1_is_min ? [amount_1_min, amount_2_min] : [amount_2_min, amount_1_min]

        const add_liquidity: AddLiquidityTx = {
            signer: signer,
            pool: pool,
            tokenX: tokenX,
            tokenY: tokenY,
            amountXDesired: amountX,
            amountYDesired: amountY,
            amountXMin: amountXMin,
            amountYMin: amountYMin,
            to: signer.address,
            deadline: options.deadline!,
            Router: Router,
        }

        return add_liquidity
}