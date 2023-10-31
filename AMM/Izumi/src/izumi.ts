import { ethers, Wallet } from 'ethers';
import { resolve_chain } from './utils';
import { exec_swap } from './transactions/swap';
import { get_swap_tx } from './calldata/swapCalldata';
import { exec_approve } from './transactions/approve';
import { get_add_liq_tx } from './calldata/addLiqCalldata';
import { get_approve_tx } from './calldata/approveCalldata';
import { get_remove_tx } from './calldata/withdrawLiqCalldata';
import { exec_add_liquidity } from './transactions/addLiquidity';
import { exec_decrease, exec_collect } from './transactions/remove';
import { AddOptions, Chains, RemoveOptions } from '../types';
import { SwapOptions } from '../types/swap';
import { DEFAULT_REMOVE_OPTION, DEFAULT_ADD_OPTION, DEFAULT_SWAP_OPTION, CONTRACTS } from "../config/constants"





/**
 * @name swap
 * @param signer        - Wallet to perform the swap
 * @param path          - token swap from path[0](input) to path[1](output) 
 * @param amount        - The amount of token to be sent or received 
 * @param chain         - The chain's name to operate the swap
 * @param options
 *        - tradeType     (optional) 0 = swap EXACT input, 1 = swap EXACT output (DEFAULT => 0)
 *        - max:          (optional) If activated it will check for the highest amount possible from tokenA and tokenB 
 *        - percent       (optional) Percentage of Liquidity Tokens (lp) to withdraw 
 *        - slipage:      (optional) protection against price movement or to high price impact (DEFAULT => 0.5%)
 *        - deadline:     (optional) Maximum amount of time (in unix time) before the trade get reverted (DEFAULT => 20 minutes)
 */
export const swap = async(
    signer: Wallet,
    path: [string, string],
    amount: string,
    chain: Chains,
    options: SwapOptions = DEFAULT_SWAP_OPTION
) => {
    
    signer = resolve_chain( signer, chain )

    try {

        if ( path[0] === undefined || path[1] === undefined )
            throw(`Error: token undefined path[0]: ${ path[0] }, path[1]: ${ path[1] }.`)
        if ( options.slipage! < 0.01 || options.slipage! > 100 )
            throw(`Slipage parameter must be a number between 0.01 and 100.`)


        const swapTx = await get_swap_tx( signer, path, amount, chain, options )
        const approve_amount = ethers.formatUnits( swapTx.trade.amountInMax ?? swapTx.trade.amountIn, swapTx.trade.tokenIn.decimals )

        const approveTx = await get_approve_tx( signer, swapTx.trade.tokenIn, CONTRACTS[ chain ].periphery.swap, approve_amount, chain )

        /*========================================= TX =================================================================================================*/
        await exec_approve( approveTx )
        await exec_swap( swapTx )
        /*=============================================================================================================================================*/
        
    } catch (error: any) {

        throw error

    }
}


 


/**
 * @name addLiquidity
 * @param signer        - Wallet to perform the swap
 * @param addressA      - First token
 * @param amountA       - Amount of first token. if set to null will check for amountB or max
 * @param addressB      - Second token
 * @param amountB       - Amount of second token. if set to null will check for amountA or max
 * @param chain         - The chain's name to operate the swap
 * @param options
 *        - max:        (optional) If activated it will check for the highest amount possible from tokenA and tokenB  
 *        - slipage:    (optional) Protection against price movement or to high price impact default is 0.5%
 *        - deadline:   (optional) Maximum amount of time (in unix time) before the trade get reverted
 */
export const addLiquidity = async(
    signer: Wallet,                        
    addressA: string,                       
    amountA: string | null,     
    addressB: string,                       
    amountB: string | null,     
    chain: Chains,
    options: AddOptions = DEFAULT_ADD_OPTION
): Promise<void> => {
/*
    signer = resolve_chain( signer, chain )

    try {

        if ( options!.slipage! < 0.01 || options!.slipage! > 100 )
            throw("Slipage need to be a number between 2 and 100");
        if ( amountA === null && amountB === null && options!.max === false )
            throw("Need to provide at least a value for 'amountA' or 'amountB' or set max");

        
        // Get add liquidity Tx
        const addTx = await get_add_liq_tx( signer, addressA, amountA, addressB, amountB, chain, options )
        const { tokenA, tokenB, amountADesired, amountBDesired } = addTx
        const approve_amount_a = ethers.formatUnits( amountADesired, tokenA.decimals )
        const approve_amount_b = ethers.formatUnits( amountBDesired, tokenB.decimals )


        // Get approve token 'a' Tx
        const approveATx = await get_approve_tx(signer, tokenA, CONTRACTS[ chain ].periphery.swap, approve_amount_a, chain)

        // Get approve token 'b' Tx
        const approveBTx = await get_approve_tx(signer, tokenB, CONTRACTS[ chain ].periphery.swap, approve_amount_b, chain)
*/
        /*========================================= TX =================================================================================================*/
        // await exec_approve( approveATx )
        // await exec_approve( approveBTx )
        // await exec_add_liquidity( addTx )
        /*=============================================================================================================================================*/
 /*       
    } catch (error: any) {

        throw error

    }
*/
}





/**
 * @name withdrawLiquidity
 * @param signer         - The Wallet to widthdraw its Liquidity Tokens (lp) 
 * @param tokenA         - Address of token A
 * @param tokenB         - Address of token B
 * @param chain          - The chain's name to operate the swap
 * @param options       
 *        - slipage        (optional) protection against price movement or to high price impact default is 2%
 *        - deadline:      (optional) Maximum amount of time (in unix time) before the trade get reverted
 *        - percent        (optional) Percentage of Liquidity Tokens (lp) to withdraw default is 100%
 */
export const withdrawLiquidity = async(
    signer: Wallet, 
    tokenA: string, 
    tokenB: string, 
    chain: Chains,
    options: RemoveOptions = DEFAULT_REMOVE_OPTION
) => {

    signer = resolve_chain( signer, chain )

    try {

        if ( options.slipage! < 0 || options.slipage! > 100 )
            throw new Error("Slipage need to be a number between 0 and 100");
        if ( options.percent! <= 0 || options.percent! > 100 )
            throw new Error("Percent need to be set between 0 to 100")


        // Get widthdraw liquidity Tx
        const removeTx = await get_remove_tx( signer, tokenA, tokenB, chain, options )

        /*========================================= TX =================================================================================================*/        
        // await exec_decrease( removeTx )
        // await exec_collect( removeTx )
        /*=============================================================================================================================================*/

    } catch (error: any) {

        throw error

    }
}
