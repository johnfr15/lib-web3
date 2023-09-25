import { ethers } from "ethers"
import { SwapTx, SwapExactETHForTokens, SwapETHForExactTokens, SwapExactTokensForETH, SwapTokensForExactETH } from "../types";

export const swapExactETHForTokens = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router, slipage, deadline } = swapTx

    try {

        console.log(`\n\nSwapping exact ${ trade.inputAmount.toExact() } ${ trade.inputAmount.currency.symbol } for (min)${ trade.minimumAmountOut( slipage ).toExact() } ${ trade.outputAmount.currency.symbol }`)      

        const args: SwapExactETHForTokens = { 
            amountOutMin: trade.minimumAmountOut( slipage ).raw, 
            path: [ trade.route.path[0].address, trade.route.path[1].address ], 
            to: signer.address, 
            deadline: deadline 
        }

        const feesPerGas = await Router.swapExactETHForTokens.estimateGas( ...Object.values( args ), { value: trade.inputAmount.raw } )
    
        const tx = await Router.swapExactETHForTokens( args, { value: trade.inputAmount.raw , maxPriorityFeePerGas: feesPerGas } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Total feesPerGas: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }

}

export const swapETHForExactTokens = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router, slipage, deadline } = swapTx

    try {

        console.log(`\n\nSwapping (max)${ trade.maximumAmountIn( slipage ).toExact() } ${ trade.inputAmount.currency.symbol } for exact ${ trade.outputAmount.toExact() } ${ trade.outputAmount.currency.symbol }`)
        
        const args: SwapETHForExactTokens = { 
            amountOut: trade.outputAmount.raw, 
            path: [ trade.route.path[0].address, trade.route.path[1].address ], 
            to: signer.address, 
            deadline: deadline 
        }

        const feesPerGas = await Router.swapETHForExactTokens.estimateGas( ...Object.values( args ), { value: trade.maximumAmountIn( slipage ).raw } )
    
        const tx = await Router.swapETHForExactTokens( args, { value: trade.maximumAmountIn( slipage ).raw, maxPriorityFeePerGas: feesPerGas } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Total feesPerGas: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}

export const swapExactTokensForETH = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router, slipage, deadline } = swapTx

    try {

        console.log(`\n\nSwapping exact ${ trade.inputAmount.toExact() } ${ trade.inputAmount.currency.symbol } for (min)${ trade.minimumAmountOut( slipage ).toExact() } ${ trade.outputAmount.currency.symbol }`)      
        
        const args: SwapExactTokensForETH = { 
            amountIn: trade.inputAmount.raw, 
            amountOutMin: trade.minimumAmountOut( slipage ).raw, 
            path: [ trade.route.path[0].address, trade.route.path[1].address ], 
            to: signer.address, 
            deadline: deadline 
        }

        const feesPerGas = await Router.swapExactTokensForETH.estimateGas( ...Object.values( args ) )
    
        const tx = await Router.swapExactTokensForETH( args, { maxPriorityFeePerGas: feesPerGas } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Total feesPerGas: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )
    }
}

export const swapTokensForExactETH = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router, slipage, deadline } = swapTx

    try {
        
        console.log(`\n\nSwapping (max)${ trade.maximumAmountIn( slipage ).toExact() } ${ trade.inputAmount.currency.symbol } for exact ${ trade.outputAmount.toExact() } ${ trade.outputAmount.currency.symbol }`)      

        const args: SwapTokensForExactETH = { 
            amountOut: trade.outputAmount.raw, 
            amountInMax: trade.maximumAmountIn( slipage ).raw, 
            path: [ trade.route.path[0].address, trade.route.path[1].address ], 
            to: signer.address, 
            deadline: deadline 
        }

        const feesPerGas = await Router.swapTokensForExactETH.estimateGas( ...Object.values( args ) )
    
        const tx = await Router.swapTokensForExactETH( args, { maxPriorityFeePerGas: feesPerGas } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Total feesPerGas: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}