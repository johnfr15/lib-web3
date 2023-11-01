import { ethers, Wallet, Contract } from "ethers";
import { AddOptions, Chains, Pool, Token } from "../../types";
import { get_token, get_balance, get_pool, sort_tokens, is_balance, get_quote } from "../utils";
import { find_liquidity, get_liquidity } from "../utils/add"
import { RIGHT_MOST_PT, LEFT_MOST_PT, CONTRACTS, LIQUIDITY_MANAGER_ABI } from "../../config/constants";
import { Liquidity, AddLiquidityTx } from "../../types/add";


export const get_add_liq_tx = async(
    signer: Wallet, 
    addressA: string,
    amountA: string | null,
    addressB: string,
    amountB: string | null,
    chain: Chains,
    options: AddOptions
): Promise<AddLiquidityTx> => {

    let addTx: AddLiquidityTx;

    const token_a: Token = await get_token( addressA, chain )
    const token_b: Token = await get_token( addressB, chain )
    const { token0, token1, amount0, amount1 } = sort_tokens( token_a, token_b, amountA, amountB )

    const pool: Pool = await get_pool( token0, token1, signer, chain )

    if ( await is_balance(signer, token_a.address, token_b.address) === 0 )
        throw new Error(`balance is empty for token ${ token_a.symbol } or ${ token_b.symbol } or both.`)

    if ( options.max || options.percent )
    {
        addTx = await get_max_liq( signer, pool, chain, options )
    }
    else
    {
        let addr: string = amount0 ? pool.tokenX.address : pool.tokenY.address
        let amount: bigint = amount0 ? amount0 : amount1!
        addTx = await get_liq( signer, pool, addr, amount, chain, options )
    }

    return addTx
}

const get_max_liq = async(
    signer: Wallet, 
    pool: Pool,
    chain: Chains,
    options: AddOptions
): Promise<AddLiquidityTx> => {

    let liquidity: Liquidity | undefined
    const { max, percent } = options

    const NftManager = new Contract( CONTRACTS[ chain ].periphery.liquidityManager, LIQUIDITY_MANAGER_ABI, signer )

    if ( options.tokenId )
        liquidity = await get_liquidity( pool.tokenX, pool.tokenY, chain, options.tokenId, signer )
    else
        liquidity = await find_liquidity( pool.tokenX, pool.tokenY, chain, signer )

    const balanceX = await get_balance( pool.tokenX.address, signer )
    const balanceY = await get_balance( pool.tokenY.address, signer )
    const amountX = max ? balanceX.bigint : balanceX.bigint * BigInt(percent! *  100) / BigInt(100 * 100 )
    const amountY = max ? balanceY.bigint : balanceY.bigint * BigInt(percent! *  100) / BigInt(100 * 100 )

    const quote_a = get_quote( parseFloat( ethers.formatUnits( amountX, balanceX.decimals ) ), pool.tokenX, pool )
    const quote_b = get_quote( parseFloat( ethers.formatUnits( amountY, balanceY.decimals ) ), pool.tokenY, pool )

    /*
    * @dev If the amount of token B we can buy is bigger than our actual balance of token B that means
    *      that token B is our max token to add
    */
    const b_is_min_balance: boolean = quote_a > amountY 

    let balance_a: bigint = b_is_min_balance ? quote_b : amountX
    let balance_b: bigint = b_is_min_balance ? amountY : quote_a
    let balance_a_min: bigint = balance_a * BigInt( 100 * 100 - (options.slipage! * 100) ) / BigInt( 100 * 100 )
    let balance_b_min: bigint = balance_b * BigInt( 100 * 100 - (options.slipage! * 100) ) / BigInt( 100 * 100 )


    const add_liquidity: AddLiquidityTx = {
        signer: signer,
        pool: pool,
        tokenX: pool.tokenX,
        tokenY: pool.tokenY,
        fee: pool.fees,
        liquidity: liquidity,
        pl: LEFT_MOST_PT / 4,
        pr: RIGHT_MOST_PT / 4,
        amountADesired: balance_a,
        amountBDesired: balance_b,
        amountAMin: balance_a_min,
        amountBMin: balance_b_min,
        to: signer.address,
        deadline: options.deadline!,
        chain: chain,
        NftManager: NftManager
    }

    return add_liquidity 
}

const get_liq = async(
    signer: Wallet, 
    pool: Pool, 
    addr: string, 
    amount: bigint, 
    chain: Chains,
    options: AddOptions
): Promise<AddLiquidityTx> => {

        let liquidity: Liquidity | undefined

        const NftManager = new Contract( CONTRACTS[ chain ].periphery.liquidityManager, LIQUIDITY_MANAGER_ABI, signer )

        if ( options.tokenId )
            liquidity = await get_liquidity( pool.tokenX, pool.tokenY, chain, options.tokenId, signer )
        else
            liquidity = await find_liquidity( pool.tokenX, pool.tokenY, chain, signer )
        
        const token_1: Token = BigInt( pool.tokenX.address ) === BigInt( addr ) ? pool.tokenX : pool.tokenY
        const token_2: Token = BigInt( pool.tokenX.address ) !== BigInt( addr ) ? pool.tokenX : pool.tokenY

        const balance_1 = await get_balance( token_1.address, signer )
        const balance_2 = await get_balance( token_2.address, signer )

        const amount_1 = amount
        const amount_2 = get_quote( parseFloat( ethers.formatUnits( amount_1, token_1.decimals ) ), token_1, pool )
        
        const amount_1_min: bigint = amount_1 * BigInt( 100 * 100 - (options.slipage! * 100) ) / BigInt( 100 * 100 )
        const amount_2_min: bigint = amount_2 * BigInt( 100 * 100 - (options.slipage! * 100) ) / BigInt( 100 * 100 )


        if ( amount_1 > balance_1.bigint )
            throw new Error(`${ token_1.symbol }: Unsufficient balance.`)
        if ( amount_2 > balance_2.bigint )
            throw new Error(`${ token_2.symbol }: Unsufficient balance.\nNeeded ${ ethers.formatUnits(amount_2, token_2.decimals) } but got ${ balance_2.string }`)


        const token_1_is_min = BigInt( pool.tokenX.address ) === BigInt( token_1.address )


        const add_liquidity: AddLiquidityTx = {
            signer: signer,
            pool: pool,
            tokenX: token_1_is_min ? token_1 : token_2,
            tokenY: token_1_is_min ? token_2 : token_1,
            fee: pool.fees,
            liquidity: liquidity,
            pl: LEFT_MOST_PT,
            pr: RIGHT_MOST_PT,
            amountADesired: token_1_is_min ? amount_1 : amount_2,
            amountBDesired: token_1_is_min ? amount_2 : amount_1,
            amountAMin: token_1_is_min ? amount_1_min : amount_2_min,
            amountBMin: token_1_is_min ? amount_2_min : amount_1_min,
            to: signer.address,
            deadline: options.deadline!,
            chain: chain,
            NftManager: NftManager
        }

        return add_liquidity
}