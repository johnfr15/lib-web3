import { ethers } from "ethers";
import { CallData, Contract, Account, uint256, Uint256 } from "starknet"
import { calc_price_impact, resolve_network_contract, resolve_pool, get_reserves, quote, get_amount_out, Uint256_to_string, is_balance, fetch_add_liq, fetch_max_add_liq, fetch_withdraw_liq, get_balance, string_to_Uint256, string_to_bigint } from './utils';
import { ERC20_ABI, TICKER } from "./constant";
import { ApproveCallData, SwapCallData, AddLiquidityCallData, AddLiquidityArgs, WidthdrawLiquidityCallData } from "./types";

export const get_approve_calldata = async(
    signer: Account, 
    amount: string, 
    token_address: string, 
    network: string
): Promise<{raw: ApproveCallData, compiled: ApproveCallData}> => {

    try {
        const MySwap = resolve_network_contract(network, signer)
        const erc20 = new Contract(ERC20_ABI, token_address, signer);
        const { decimals } = await erc20.decimals()
        const big_amount = uint256.bnToUint256( ethers.parseUnits( amount, decimals ) * ethers.toBigInt( 10 ) /  ethers.toBigInt( 8 ) )
        
        const raw: ApproveCallData = {
            contractAddress: erc20.address,
            entrypoint: "approve",
            calldata: [MySwap.address, big_amount],
        }
        const compiled: ApproveCallData = {
            contractAddress: erc20.address,
            entrypoint: "approve",
            calldata: [MySwap.address, big_amount],
        }
    
        return { raw, compiled }

    } catch (error: any) {
        
        throw error

    }

}

export const get_swap_calldata = async(
    signer: Account, 
    path: [string, string],
    amountIn: string,
    network: string,
    slipage: number,
    amountOutMin?: Uint256 | undefined | null,
): Promise<{raw: SwapCallData, compiled: SwapCallData}> => {

    try {

        const MySwap: Contract  = resolve_network_contract( network, signer )
        const pool_id: number   = resolve_pool( path[0], path[1], network )

        const { reserve_in, reserve_out } = await get_reserves( MySwap, path, pool_id )

        const balanceFrom = await get_balance( signer.address, path[0], signer )


        // Check if we have enough balance
        if ( balanceFrom.bigint < ethers.parseUnits( amountIn, balanceFrom.decimals ) )
            throw(`Error: Not enough balance for amount: ${ amountIn }. Balance is ${ balanceFrom.string }`)


        let amount_in: Uint256      = string_to_Uint256( amountIn, balanceFrom.decimals )
        let amount_out: Uint256     = get_amount_out( string_to_bigint( amountIn, balanceFrom.decimals ), reserve_in, reserve_out )

        let quote_out: bigint       = quote( uint256.uint256ToBN( amount_in ), reserve_in, reserve_out )
        let amount_out_min: Uint256 = amountOutMin ?? uint256.bnToUint256( quote_out * BigInt( (100 * 100) - slipage * 100 ) / BigInt( 100 * 100 ) )

        
        // Check that price impact do not exceed allowed amount
        if ( uint256.uint256ToBN( amount_out_min ) > uint256.uint256ToBN(amount_out) )
            throw new Error(`Price impact to high: ${ calc_price_impact( quote_out, uint256.uint256ToBN( amount_out) ) }%`)
    

        const raw: SwapCallData = {
            contractAddress: MySwap.address,
            entrypoint: "swap",
            calldata: [ pool_id, path[0], amount_in, amount_out_min ],
        }
        const compiled: SwapCallData = {
            contractAddress: MySwap.address,
            entrypoint: "swap",
            calldata: CallData.compile( [pool_id, path[0], amount_in, amount_out_min] ),
        } 

        return { raw, compiled }

    } catch (error: any) {
        
        throw error

    }
}

export const get_add_liq_calldata = async(
    signer: Account, 
    addressA: string,
    amountA: string | null,
    addressB: string,
    amountB: string | null,
    max: boolean,
    network: string,
    slipage: number,
): Promise<{raw: AddLiquidityCallData, compiled: AddLiquidityCallData}> => {
    let args: AddLiquidityArgs

    try {

        if ( amountA === null && amountB === null && max === false )
            throw new Error("Need to provide at least a value for 'amountA' or 'amountB' or set max");
        if ( await is_balance(signer, addressA, addressB) === 0 )
            throw new Error(`balance is empty for token ${TICKER[addressA]} or ${TICKER[addressB]} or both.`)

        const MySwap = resolve_network_contract(network, signer)
         
        if ( max )
        {
            args = await fetch_max_add_liq(signer, addressA, addressB, network, slipage)
        }
        else
        {
            let pool_id = resolve_pool(addressA, addressB, network)
            let addr: string = amountA ? addressA : addressB
            let amount: string = amountA ? amountA : amountB!
            args = await fetch_add_liq(signer, pool_id, addr, amount, network, slipage)
        }

        const raw: AddLiquidityCallData = {
            contractAddress: MySwap.address,
            entrypoint: "add_liquidity",
            calldata: Object.values(args).filter((item) => (typeof item !== 'bigint')),
            utils: {
                decimalsA: args.token_a_decimals,
                decimalsB: args.token_b_decimals,
            }
        }
        const compiled: AddLiquidityCallData = {
            contractAddress: MySwap.address,
            entrypoint: "add_liquidity",
            calldata: CallData.compile( Object.values(args).filter((item) => (typeof item !== 'bigint')) ),
        } 

        return { raw, compiled }

    } catch (error: any) {
        
        throw error

    }
}

export const get_widthdraw_calldata = async(
    signer: Account, 
    tokenA: string, 
    tokenB: string, 
    percent: number, 
    slipage: number, 
    network: string,
): Promise<{raw: WidthdrawLiquidityCallData, compiled: WidthdrawLiquidityCallData}> => {

    try {

        const MySwap = resolve_network_contract(network, signer)
        const pool_id = resolve_pool(tokenA, tokenB, network)

        const args = await fetch_withdraw_liq(signer, MySwap, pool_id, percent, slipage)

        let callData: any =  Object.values(args).filter((item) => (typeof item !== 'bigint') && (typeof item !== 'string'))

        const raw: WidthdrawLiquidityCallData = {
            contractAddress: MySwap.address,
            entrypoint: "withdraw_liquidity",
            calldata: callData,
            utils: {
                decimalsA: args.a_decimals,
                decimalsB: args.b_decimals,
                decimalsLp: args.lp_decimals,
                addrA: args.addr_a,
                addrB: args.addr_b,
                addrLp: args.lp_address,
            }
        }
        const compiled: WidthdrawLiquidityCallData = {
            contractAddress: MySwap.address,
            entrypoint: "withdraw_liquidity",
            calldata: callData,
        } 

        return { raw, compiled }

    } catch (error: any) {
        
        throw error

    }
}