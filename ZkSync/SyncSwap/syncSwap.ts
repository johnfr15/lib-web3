import { ethers, Wallet } from 'ethers';
import { TICKER } from './config/constants';
import { is_balance, is_native } from './utils';
import { get_swap_tx } from './calldata/swapCalldata';
import { get_approve_tx } from './calldata/approveCalldata';
import { get_add_liq_tx } from './calldata/addLiqCalldata';
import { get_remove_tx } from './calldata/withdrawLiqCalldata';
import { exec_swap } from './transactions/swap';
import { exec_approve } from './transactions/approve';
import { exec_add_liquidity } from './transactions/addLiquidity';
import { exec_remove } from './transactions/remove';





/**
 * @name swap
 * @param signer        - Wallet to perform the swap
 * @param path          - token swap from path[0](input) to path[1](output) 
 * @param amountIn      - The amount of exact token (in token) to be swapped for the other one **(out token)**  
 * @param network       - (optional) 'testnet' is the default one
 * @param slipage       - (optional) protection against price movement or to high price impact default is 0.5%
 * @param priceImpact   - (optional) protection against price movement or to high price impact default is 2%
 * @param deadline      - (optional) Maximum amount of time (in unix time) before the trade get reverted
 * @param maxFees       - (optional) max fees signer is ready to pay for executing transaction
 */
export const swap = async(
    signer: Wallet,
    path: [string, string],
    amountIn: string,
    network: 'TESTNET' | 'MAINNET' = 'TESTNET',
    slipage: number = 0.5, // this represent 0.5% of slipage
    priceImpact: number = 0.5, // this represent 2% of allowed price impact (default)
    deadline?: number,
) => {

    let approveTx: any

    try {

        if ( slipage < 0.01 || slipage > 100 )
            throw(`Slipage parameter must be a number between 0.01 and 100`)


        // Get swap Tx
        const swapTx = await get_swap_tx( signer, path, amountIn, network, slipage, priceImpact, deadline )

        // Get approve Tx
        if ( is_native( path[0] ) === false )
            approveTx = await get_approve_tx( signer, amountIn, path[0], network )


        /*========================================= TX =================================================================================================*/
        if ( approveTx )
        {
            await exec_approve( approveTx, signer )
        }

        await exec_swap( swapTx, signer )
        /*=============================================================================================================================================*/
        
    } catch (error: any) {

        throw error

    }
}


 


/**
 * @name addLiquidity
 * @param signer        // Wallet to perform the swap
 * @param addressA      // First token
 * @param amountA       // Amount of first token. if set to null will check for amountB or max
 * @param addressB      // Second token
 * @param amountB       // Amount of second token. if set to null will check for amountA or max
 * @param max           // (optional, recommended) if activated it will check for the highest amount possible from tokenA and tokenB
 * @param network       // (optional) 'testnet' is the default one
 * @param slipage       // (optional) protection against price movement or to high price impact default is 0.5%
 */
export const addLiquidity = async(
    signer: Wallet,                        
    addressA: string,                       
    amountA: string | null,     
    addressB: string,                       
    amountB: string | null,     
    max: boolean = false,                         
    network: 'TESTNET' | 'MAINNET' = 'TESTNET',
    slipage: number = 2, // this represent 2% of slipage
): Promise<void> => {

    try {

        if ( slipage < 2 || slipage > 100 )
            throw("Slipage need to be a number between 2 and 100");
        if ( amountA === null && amountB === null && max === false )
            throw("Need to provide at least a value for 'amountA' or 'amountB' or set max");
        if ( await is_balance( signer, addressA, addressB ) === 0 )
            throw(`balance is empty for token ${ TICKER[ addressA ] } or ${ TICKER[ addressB ] } or both.`)

        
        const addTx = await get_add_liq_tx( signer, addressA, amountA, addressB, amountB, max, network, slipage )
        const { tokenA, tokenB, inputs } = addTx

        
        const approveATx = await get_approve_tx(signer, ethers.formatUnits( inputs[0].amount, tokenA.decimals ), inputs[0].token, network)
        
        const approveBTx = await get_approve_tx(signer, ethers.formatUnits( inputs[1].amount, tokenB.decimals ), inputs[1].token, network)

        /*========================================= TX =================================================================================================*/
        await exec_approve( approveATx, signer )
        await exec_approve( approveBTx, signer )
        await exec_add_liquidity( addTx, signer )
        /*=============================================================================================================================================*/
        
    } catch (error: any) {

        throw error

    }
}





/**
 * @name withdrawLiquidity
 * @param signer                 - The Wallet to widthdraw its Liquidity Tokens (lp) 
 * @param tokenA                 - Address of token A
 * @param tokenB                 - Address of token B
 * @param percent                - (optional) Percentage of Liquidity Tokens (lp) to withdraw default is 100%
 * @param network                - (optional) 'testnet' is the default one
 * @param slipage                - (optional) protection against price movement or to high price impact default is 2%
 * @param deadline               - (optional) Maximum amount of time (in unix time) before the trade get reverted
 */
export const withdrawLiquidity = async(
    signer: Wallet, 
    tokenA: string, 
    tokenB: string, 
    percent: number = 100, 
    network: 'TESTNET' | 'MAINNET' = 'TESTNET', 
    slipage: number = 2, // this represent 0.5% of allowed slipage (default)
    deadline: number | null = null,
) => {

    try {
        if ( slipage < 0 || slipage > 100 )
            throw new Error("Slipage need to be a number between 0 and 100");
        if ( percent <= 0 || percent > 100 )
            throw new Error("Percent need to be set between 0 to 100")


        // Get widthdraw liquidity Tx
        const removeTx = await get_remove_tx( signer, tokenA, tokenB, percent, slipage, network, deadline )
        const { liquidity, balanceLp, pool } = removeTx

        // Get approve Tx
        const approveTx = await get_approve_tx(signer, ethers.formatUnits( liquidity, balanceLp.decimals ), pool, network)

        /*========================================= TX =================================================================================================*/        
        await exec_approve( approveTx, signer )
        await exec_remove( removeTx, signer )
        /*=============================================================================================================================================*/

    } catch (error: any) {

        throw error

    }
}
