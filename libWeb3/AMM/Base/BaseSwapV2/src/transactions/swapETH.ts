import { ethers } from "ethers"
import { SwapTx } from "../../types/swap"
import { enforce_swap_fees } from "../utils/swap"
import { SwapETHForExactTokens, SwapExactETHForTokens } from "../../types/swap"

export const swapExactETHForTokens = async( swapTx: SwapTx ): Promise<void> => {
    
    const { signer, trade, Router, options } = swapTx
    let { amountIn, amountOut, amountOutMin, path, tokenIn, tokenOut, deadline } = trade

    console.log(`\n\nSwapping exact ${ ethers.formatEther( amountIn ) } ${ tokenIn.symbol } ` +
    `for ${ ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

    const args: SwapExactETHForTokens = { 
        amountOutMin: amountOutMin,
        path: path,
        to: signer.address, 
        deadline: deadline 
    }
    const { value, tx: txArgs  } = await enforce_swap_fees( swapTx, args, options )

    const nonce = await signer.getNonce()

    const tx = await Router.swapExactETHForTokens(  ...Object.values( txArgs ), { value: value, nonce: nonce } )
    const receipt = await tx.wait()

    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

}





export const swapETHForExactTokens = async( swapTx: SwapTx ): Promise<void> => {
    
    const { signer, trade, Router, options } = swapTx
    let { amountIn, amountOut, path, tokenIn, tokenOut, deadline } = trade

    console.log(`\n\nSwapping exact ${ ethers.formatEther( amountIn ) } ${ tokenIn.symbol } ` +
    `for ${ ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

    const args: SwapETHForExactTokens = { 
        amountOut: amountOut, 
        path: path,
        to: signer.address, 
        deadline: deadline 
    }
    const { value, tx: txArgs } = await enforce_swap_fees( swapTx, args, options )

    const nonce = await signer.getNonce()

    const tx = await Router.swapExactETHForTokens(  ...Object.values( txArgs ), { value: value, nonce: nonce } )
    const receipt = await tx.wait()

    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

}