import { ethers } from "ethers";
import { CallData, Calldata, Contract, Account, uint256, Uint256 } from "starknet"
import { get_share_rate, calc_price_impact, resolve_network_contract, resolve_pool, get_reserves, quote, get_amount_out, Uint256_to_string, approve, is_balance, fetch_add_liq, fetch_max_add_liq, fetch_withdraw_liq, get_balance, string_to_Uint256, bn_to_string } from './utils';
import { ERC20_ABI } from "./constant";
import { ApproveCallData, SwapCallData } from "./types";

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

        const MySwap = resolve_network_contract(network, signer)
        const pool_id = resolve_pool(path[0], path[1], network)
        const { reserve_in, reserve_out } = await get_reserves(MySwap, path, pool_id)
        
        const { decimals: decimals_from } = await get_balance(signer.address, signer, path[0])
        

        let amount_in: Uint256 = string_to_Uint256( amountIn, decimals_from )
        let quote_: bigint = await quote( ethers.parseUnits( Uint256_to_string( amount_in, decimals_from ), decimals_from ), reserve_in, reserve_out )
        let amount_out_min: Uint256 = amountOutMin ?? uint256.bnToUint256( quote_ * ethers.toBigInt(slipage) / ethers.toBigInt(1000) )
        let amount_out: Uint256 = get_amount_out( ethers.parseUnits(amountIn, decimals_from), reserve_in, reserve_out )
        
        if ( uint256.uint256ToBN(amount_out_min) > uint256.uint256ToBN(amount_out) )
            throw new Error(`Price impact to high: ${ calc_price_impact( quote_, uint256.uint256ToBN( amount_out) ) }%`)
    
        const raw: SwapCallData = {
            contractAddress: MySwap.address,
            entrypoint: "swap",
            calldata: [pool_id, path[0], amount_in, amount_out_min],
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