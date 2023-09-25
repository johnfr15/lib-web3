import { ethers } from "ethers"
import { SwapTx, SwapExactTokensForTokens, SwapTokensForExactTokens } from "../types";

export const swapExactTokensForTokens = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router, slipage, deadline } = swapTx

    try {
        
        console.log(`\n\nSwapping exact ${ trade.inputAmount.toExact() } ${ trade.inputAmount.currency.symbol } for  (min)${ trade.minimumAmountOut( slipage ).toExact() } ${ trade.outputAmount.currency.symbol }`)      

        const args: SwapExactTokensForTokens = { 
            amountIn: trade.inputAmount.raw, 
            amountOutMin: trade.minimumAmountOut( slipage ).raw, 
            path: [ trade.route.path[0].address, trade.route.path[1].address ], 
            to: signer.address, 
            deadline: deadline
        }

        const feesPerGas = await Router.swapExactTokensForTokens.estimateGas( ...Object.values( args ) )
    
        const tx = await Router.swapExactTokensForTokens( args, { maxPriorityFeePerGas: feesPerGas } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Total feesPerGas: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {

        throw( error )

    }
}

export const swapTokensForExactTokens = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router, slipage, deadline } = swapTx

    try {
        
        console.log(`\n\nSwapping (max)${ trade.maximumAmountIn( slipage ).toExact() } ${ trade.inputAmount.currency.symbol } for exact ${ trade.outputAmount.toExact() } ${ trade.outputAmount.currency.symbol }`)      

        const args: SwapTokensForExactTokens = { 
            amountOut: trade.outputAmount.raw, 
            amountInMax: trade.maximumAmountIn( slipage ).raw, 
            path: [ trade.route.path[0].address, trade.route.path[1].address ], 
            to: signer.address, 
            deadline: deadline 
        }

        const feesPerGas = await Router.swapTokensForExactTokens.estimateGas( ...Object.values( args ) )
    
        const tx = await Router.swapTokensForExactTokens( args, { maxPriorityFeePerGas: feesPerGas } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Total feesPerGas: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {

        throw( error )

    }
}