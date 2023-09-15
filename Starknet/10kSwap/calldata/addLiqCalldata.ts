import { ethers } from "ethers";
import { Account, Contract, Uint256, uint256 } from "starknet"
import { TICKER, l0K_ROUTER_ABI, ROUTER_ADDRESSES } from "../constant";
import { AddLiquidityCallData, AddLiquidityTx } from "../types";
import { get_token, sort_tokens, get_balance, sort_tokens_2, Uint256_to_string } from "../utils";
import { Fetcher, Fraction, Pair, Token } from "l0k_swap-sdk";


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

        const token_a = await get_token( addressA, network, signer )
        const token_b = await get_token( addressB, network, signer )

        const { token0, token1 } = sort_tokens_2( token_a, token_b )
        const pool = await Fetcher.fetchPairData( token0, token1 )

        if ( max )
        {
            add_liq_tx = await get_max_liq( signer, token0, token1, pool, network, slipage, deadline )
        }
        else
        {
            let addr: string = amountA ? addressA : addressB
            let amount: string = amountA ? amountA : amountB!
            add_liq_tx = await get_liq( signer, pool, addr, amount, network, slipage, deadline )
        }

        const add_liq_callData: AddLiquidityCallData = {
            addTx: add_liq_tx,
            utils: { 
                signer: signer, 
                network: network,
                slipage: slipage,
                deadline: deadline,
                tokenA: token0, 
                tokenB: token1, 
                pool: pool 
            }
        } 

        return add_liq_callData

    } catch (error: any) {
        
        throw error

    }
}

const get_max_liq = async(
    signer: Account, 
    tokenA: Token, 
    tokenB: Token,
    pool: Pair,
    network: string,
    slipage: number,
    deadline: number,
): Promise<AddLiquidityTx> => {

    try {
        
        const router = new Contract( l0K_ROUTER_ABI, ROUTER_ADDRESSES[ network ], signer )

        const balanceA = await get_balance( signer.address, tokenA.address, signer )
        const balanceB = await get_balance( signer.address, tokenB.address, signer )

        const reserve_a: bigint = ethers.parseUnits( pool.reserveOf( tokenA ).toSignificant(2), tokenA.decimals )
        const reserve_b: bigint = ethers.parseUnits( pool.reserveOf( tokenB ).toSignificant(2), tokenB.decimals )

        const { amountB: quote_a } = await router.functions.quote( balanceB.uint256, reserve_b, reserve_a )
        const { amountB: quote_b } = await router.functions.quote( balanceA.uint256, reserve_a, reserve_b )


        /**
         * @dev If the amount of token B we can buy is bigger than our actual balance of token B that means
         *      that token B is our max token to add
         */
        const b_is_min_balance: boolean = uint256.uint256ToBN( quote_b ) > balanceB.bigint
        
        let amount_a: bigint     = b_is_min_balance ? uint256.uint256ToBN( quote_a ) : balanceA.bigint;
        let amount_b: bigint     = b_is_min_balance ? balanceB.bigint : uint256.uint256ToBN( quote_b );
        let balance_a_min: bigint = amount_a * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        let balance_b_min: bigint = amount_b * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )


        return {
            contractAddress: router.address,
            entrypoint: "addLiquidity",
            calldata: [
                tokenA.address,
                tokenB.address,
                uint256.bnToUint256( amount_a ),
                uint256.bnToUint256( amount_b ),
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
    pool: Pair, 
    addr: string, 
    amount: string, 
    network: string, 
    slipage: number, 
    deadline: number
): Promise<AddLiquidityTx> => {

    try {
        
        const router = new Contract( l0K_ROUTER_ABI, ROUTER_ADDRESSES[ network ], signer )

        const token_1: Token = BigInt( pool.token0.address ) === BigInt( addr ) ? pool.token0 : pool.token1
        const token_2: Token = BigInt( pool.token0.address ) !== BigInt( addr ) ? pool.token0 : pool.token1

        const balance_1 = await get_balance(signer.address, token_1.address, signer)
        const balance_2 = await get_balance(signer.address, token_2.address, signer)
        
        const reserve_1: bigint = ethers.parseUnits( pool.reserveOf( token_1 ).toSignificant(2), token_1.decimals )
        const reserve_2: bigint = ethers.parseUnits( pool.reserveOf( token_2 ).toSignificant(2), token_2.decimals )

        const amount_1: bigint = ethers.parseUnits( amount, token_1.decimals )
        const { amountB } =  await router.functions.quote( uint256.bnToUint256( amount_1 ), reserve_1, reserve_2 )
        const amount_2: bigint = uint256.uint256ToBN( amountB )

        const amount_1_min: bigint = amount_1 * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        const amount_2_min: bigint = amount_2 * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        if ( amount_1 > balance_1.bigint )
            throw new Error(`${ TICKER[ token_1.address ] }: Unsufficient balance.`)
        if ( amount_2 > balance_2.bigint )
            throw new Error(`${ TICKER[ token_2.address ] }: Unsufficient balance.\nNeeded ${ ethers.formatUnits(amount_2, token_2.decimals) } but got ${ balance_2.string }`)

        const { token0: tokenA, token1: tokenB } = sort_tokens_2( token_1, token_2 )
            
        return {
            contractAddress: router.address,
            entrypoint: "addLiquidity",
            calldata: [
                BigInt( tokenA.address ) === BigInt( token_1.address ) ? token_1.address : token_2.address,
                BigInt( tokenB.address ) === BigInt( token_1.address ) ? token_1.address : token_2.address,
                uint256.bnToUint256( BigInt( tokenA.address ) === BigInt( token_1.address ) ? amount_1 : amount_2 ),
                uint256.bnToUint256( BigInt( tokenB.address ) === BigInt( token_1.address ) ? amount_1 : amount_2 ),
                uint256.bnToUint256( BigInt( tokenA.address ) === BigInt( token_1.address ) ? amount_1_min : amount_2_min ),
                uint256.bnToUint256( BigInt( tokenB.address ) === BigInt( token_1.address ) ? amount_1_min : amount_2_min ),
                signer.address,
                deadline
            ]
        }

    } catch(error) {

        throw error

    }
}