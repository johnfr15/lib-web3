import { ethers, TransactionReceipt, TransactionRequest, TransactionResponse, Wallet } from 'ethers';
import { ROUTER_ADDRESS, TICKER } from './config/constants';
import { is_balance, is_native } from './utils';
import { get_swap_tx } from './calldata/swapCalldata';
import { get_approve_tx } from './calldata/approveCalldata';
import { get_add_liq_tx } from './calldata/addLiqCalldata';
import { get_remove_tx } from './calldata/withdrawLiqCalldata';





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
    priceImpact: number = 2, // this represent 2% of allowed price impact (default)
    deadline?: number,
    maxFees?: bigint,
) => {

    let approveTx: TransactionRequest | undefined
    let tx1: TransactionResponse, receipt1: TransactionReceipt | null
    let tx2: TransactionResponse, receipt2: TransactionReceipt | null

    try {

        if ( slipage < 0.01 || slipage > 100 )
            throw(`Slipage parameter must be a number between 0.01 and 100`)


        // Get swap Tx
        const { swapTx, trade } = await get_swap_tx( signer, path, amountIn, network, slipage, priceImpact, deadline )

        // Get approve Tx
        if ( is_native( path[0] ) === false )
            approveTx = await get_approve_tx( signer, amountIn, path[0], network )


        /*========================================= TX 1 ================================================================================================*/
        if ( approveTx )
        {
            console.log(`1) Approving ${ ROUTER_ADDRESS[ network ] } to spend ${ amountIn } ${ TICKER[ path[0] ] }...`)

            const gasTx1 = await signer.estimateGas( approveTx )
            approveTx.maxFeePerGas = gasTx1

            tx1 = await signer.sendTransaction( approveTx )
            receipt1 = await tx1.wait()

            console.log("Transaction valided !")
            console.log("hash: ", tx1.hash)
            console.log("Fees: ", ethers.formatEther( receipt1?.fee ?? '0' ))
        }
        /*=============================================================================================================================================*/

        /*========================================= TX 2 ================================================================================================*/
        console.log(`2) Swapping exact ${ amountIn } ${ TICKER[ path[0] ] } for (min)${ ethers.formatUnits( trade.amountOutMin, trade.tokenTo.decimals ) } ${ TICKER[ path[1] ] }`)      

        const gasTx2 = await signer.estimateGas( swapTx )
        swapTx.maxFeePerGas = maxFees ?? gasTx2

        tx2 = await signer.sendTransaction( swapTx )
        receipt2 = await tx2.wait()
        
        console.log("Transaction valided !")
        console.log("hash: ", tx2.hash)
        console.log("Fees: ", ethers.formatEther( receipt2?.fee ?? '0' ))
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
 * @param maxFees       // (optional) max fees signer is ready to pay for executing transaction
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
    deadline: number | null = null,
    maxFees?: bigint,
): Promise<void> => {

    let tx1: TransactionResponse, receipt1: TransactionReceipt | null
    let tx2: TransactionResponse, receipt2: TransactionReceipt | null
    let tx3: TransactionResponse, receipt3: TransactionReceipt | null

    try {

        if ( slipage < 2 || slipage > 100 )
            throw("Slipage need to be a number between 2 and 100");
        if ( amountA === null && amountB === null && max === false )
            throw("Need to provide at least a value for 'amountA' or 'amountB' or set max");
        if ( await is_balance( signer, addressA, addressB ) === 0 )
            throw(`balance is empty for token ${ TICKER[ addressA ] } or ${ TICKER[ addressB ] } or both.`)

        
        // Get add liquidity Tx
        const addLiqTx = await get_add_liq_tx( signer, addressA, amountA, addressB, amountB, max, network, slipage, deadline )
        const { addTx, addLiquidity } = addLiqTx
        const { tokenA, tokenB, amountADesired, amountBDesired } = addLiquidity

        // Get approve token 'a' Tx
        const approveATx = await get_approve_tx(signer, ethers.formatUnits( amountADesired, tokenA.decimals ), tokenA.address, network)

        // Get approve token 'b' Tx
        const approveBTx = await get_approve_tx(signer, ethers.formatUnits( amountBDesired, tokenB.decimals ), tokenB.address, network)

        /*========================================= TX 1 ================================================================================================*/
        console.log(`1) Approving ${ ROUTER_ADDRESS[ network ] } to spend ${ ethers.formatUnits( amountADesired, tokenA.decimals ) } ${ TICKER[ tokenA.address ] }...`)

        const gasTx1 = await signer.estimateGas( approveATx )
        approveATx.maxFeePerGas = gasTx1

        tx1 = await signer.sendTransaction( approveATx )
        receipt1 = await tx1.wait()

        console.log("Transaction valided !")
        console.log("hash: ", tx1.hash)
        console.log("Fees: ", ethers.formatEther( receipt1?.fee ?? '0' ))
        /*=============================================================================================================================================*/

        /*========================================= TX 2 ================================================================================================*/
        console.log(`2) Approving ${ ROUTER_ADDRESS[ network ] } to spend ${ ethers.formatUnits( amountBDesired, tokenB.decimals ) } ${ TICKER[ tokenB.address ] }...`)

        const gasTx2 = await signer.estimateGas( approveBTx )
        approveATx.maxFeePerGas = gasTx2

        tx2 = await signer.sendTransaction( approveBTx )
        receipt2 = await tx2.wait()

        console.log("Transaction valided !")
        console.log("hash: ", tx2.hash)
        console.log("Fees: ", ethers.formatEther( receipt2?.fee ?? '0' ))
        /*=============================================================================================================================================*/

        /*========================================= TX 2 ================================================================================================*/
        console.log(`\t3) Adding liquidity for pool ${ TICKER[ tokenA.address ] }/${ TICKER[ tokenB.address ] }` )     

        const gasTx3 = await signer.estimateGas( addTx )
        addTx.maxFeePerGas = maxFees ?? gasTx3

        tx3 = await signer.sendTransaction( addTx )
        receipt3 = await tx3.wait()
        
        console.log("Transaction valided !")
        console.log("hash: ", tx3.hash)
        console.log("Fees: ", ethers.formatEther( receipt3?.fee ?? '0' ))
        /*=============================================================================================================================================*/
        
    } catch (error: any) {

        throw error

    }
}





/**
 * @name withdrawLiquidity
 * @param signer                // The Wallet to widthdraw its Liquidity Tokens (lp) 
 * @param tokenA                // Address of token A
 * @param tokenB                // Address of token B
 * @param percent               // (optional) Percentage of Liquidity Tokens (lp) to withdraw default is 100%
 * @param network               // (optional) 'testnet' is the default one
 * @param slipage               // (optional) protection against price movement or to high price impact default is 2%
 * @param maxFees               // (optional) max fees signer is ready to pay for executing transaction
 */
export const withdrawLiquidity = async(
    signer: Wallet, 
    tokenA: string, 
    tokenB: string, 
    percent: number = 100, 
    network: 'TESTNET' | 'MAINNET' = 'TESTNET', 
    slipage: number = 0.5, // this represent 0.5% of allowed slipage (default)
    deadline: number | null = null,
    maxFees?: bigint,
) => {

    let tx1: TransactionResponse, receipt1: TransactionReceipt | null
    let tx2: TransactionResponse, receipt2: TransactionReceipt | null

    try {
        if ( slipage < 0 || slipage > 100 )
            throw new Error("Slipage need to be a number between 0 and 100");
        if ( percent <= 0 || percent > 100 )
            throw new Error("Percent need to be set between 0 to 100")


        // Get widthdraw liquidity Tx
        const withdrawTx = await get_remove_tx( signer, tokenA, tokenB, percent, slipage, network, deadline )
        const { removeTx, removeLiq } = withdrawTx
        const { liquidity, balanceLp, lp, amountAMin, amountBMin, tokenA: token0, tokenB: token1 } = removeLiq

        // Get approve Tx
        const approveTx = await get_approve_tx(signer, ethers.formatUnits( liquidity, balanceLp.decimals ), lp.address , network)

        /*========================================= TX 1 ================================================================================================*/
        console.log(`1) Approving ${ ROUTER_ADDRESS[ network ] } to spend ${ ethers.formatUnits( liquidity, balanceLp.decimals ) } ${ TICKER[ lp.address ] ?? "LP" }...`)

        const gasTx1 = await signer.estimateGas( approveTx )
        approveTx.maxFeePerGas = gasTx1

        tx1 = await signer.sendTransaction( approveTx )
        receipt1 = await tx1.wait()

        console.log("Transaction valided !")
        console.log("hash: ", tx1.hash)
        console.log("Fees: ", ethers.formatEther( receipt1?.fee ?? '0' ))
        /*=============================================================================================================================================*/

        /*========================================= TX 2 ================================================================================================*/        
        console.log(`2) Withdrawing ${ percent }% of liquidity for:\n\t\
                    (minimum)${ ethers.formatUnits( amountAMin, token0.decimals ) } ${ TICKER[ token0.address ] }\n\t\
                    (minimum)${ ethers.formatUnits( amountBMin, token1.decimals ) } ${ TICKER[ token1.address ] }
        `)

        const gasTx2 = await signer.estimateGas( removeTx )
        removeTx.maxFeePerGas = maxFees ?? gasTx2

        tx2 = await signer.sendTransaction( removeTx )
        receipt2 = await tx2.wait()
        
        console.log("Transaction valided !")
        console.log("hash: ", tx2.hash)
        console.log("Fees: ", ethers.formatEther( receipt2?.fee ?? '0' ))
        /*=============================================================================================================================================*/

    } catch (error: any) {

        throw error

    }
}
