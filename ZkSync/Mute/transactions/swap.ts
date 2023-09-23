import { ethers, Contract, Wallet, TransactionResponse, TransactionReceipt, Provider } from "ethers";
import { MUTE_ROUTER_ABI, ROUTER_ADDRESS, TICKER } from "../config/constants";
import { is_native } from "../utils";
import { Trade, SwapExactETHForTokens, SwapExactTokensForETH, SwapExactTokensForTokens } from "../types";
import { enforce_swap_fees } from "../utils/swap";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_swap = async( swapTx: Trade, signer: Wallet ): Promise<TransactionReceipt> => {

    let tx: TransactionResponse
    let feesPerGas: bigint
    let receipt: TransactionReceipt | null | undefined

    let { path, tokenFrom, tokenTo, amountIn, amountOutMin, deadline, network } = swapTx
    const Router: Contract = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer ) 


    try {

        console.log(`\n\nSwapping exact ${ ethers.formatUnits( amountIn, tokenFrom.decimals)  } ${ TICKER[ path[0] ] } for (min)${ ethers.formatUnits( amountOutMin, tokenTo.decimals ) } ${ TICKER[ path[1] ] }`)      

        if ( is_native( path[0] ) )
        {
            let args: SwapExactETHForTokens = { amountOutMin: amountOutMin, path: [ tokenFrom.address, tokenTo.address ], to: signer.address, deadline: deadline, stable: [ false ] }

            feesPerGas = await Router.swapExactETHForTokens.estimateGas( ...Object.values( args ), { value: amountIn } )
            const totalFee = feesPerGas * (await signer.provider!.getFeeData()).gasPrice!
            let { tx: newTx, amountIn: newAmountIn } = await enforce_swap_fees( swapTx, args, totalFee, signer )

            tx = await Router.swapExactETHForTokens( ...Object.values( newTx ), { value: newAmountIn, maxPriorityFeePerGas: feesPerGas } )
        }
        else if ( is_native( path[1] ) )
        {
            let args: any = [ amountIn, amountOutMin, [ tokenFrom.address, tokenTo.address ], signer.address, deadline, [ false ] ]
            feesPerGas = await Router.swapExactTokensForETH.estimateGas( ...args )
    
            tx = await Router.swapExactTokensForETH( ...args, { maxPriorityFeePerGas: feesPerGas })
        }
        else
        {

            let args: any = [ amountIn, amountOutMin, [ tokenFrom.address, tokenTo.address ], signer.address, deadline, [ false ] ]
            feesPerGas = await Router.swapExactTokensForTokens.estimateGas( ...args )
    
            tx = await Router.swapExactTokensForTokens( ...args, { maxPriorityFeePerGas: feesPerGas } )
        }
    

        receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Total feesPerGas: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')
    
        return receipt as TransactionReceipt
        
    } catch (error) {

       throw( error )
    }

}