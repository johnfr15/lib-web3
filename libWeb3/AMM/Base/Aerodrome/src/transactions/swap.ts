import { ethers } from "ethers";
import { is_native } from "../utils";
import { enforce_swap_fees } from "../utils/swap";
import { SwapTx, SwapExactETHForTokens, SwapExactTokensForETH, SwapExactTokensForTokens } from "../../types/swap";

export const exec_swap = async( swapTx: SwapTx ): Promise<void> => {

    const { tokenIn, tokenOut } = swapTx.trade

    if ( is_native( tokenIn.address )  === true  && 
         is_native( tokenOut.address ) === false ) await swapExactETHForTokens( swapTx )

    if ( is_native( tokenIn.address )  === false && 
         is_native( tokenOut.address ) === true )  await swapExactTokensForETH( swapTx )

    if ( is_native( tokenIn.address )  === false && 
         is_native( tokenOut.address ) === false ) await swapExactTokensForTokens( swapTx )
}

export const swapExactETHForTokens = async( swapTx: SwapTx ): Promise<void> => {
    
    const { signer, trade, Router, options } = swapTx
    let { amountIn, amountOut, amountOutMin, route, tokenIn, tokenOut, deadline } = trade

    console.log(`\n\nSwapping exact ${ ethers.formatEther( amountIn ) } ${ tokenIn.symbol } 
    for ${  ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

    let txArgs: SwapExactETHForTokens = { 
        amountOutMin: amountOutMin, 
        routes: [ route ], 
        to: signer.address, 
        deadline: deadline 
    }
    const { value, tx: enforce_args } = await enforce_swap_fees( swapTx, txArgs, options )

    const nonce = await signer.getNonce()

    const tx = await Router.swapExactETHForTokens(  ...Object.values( enforce_args ), { value: value, nonce: nonce } )
    const receipt = await tx.wait()

    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

}

export const swapExactTokensForETH = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountOut, amountOutMin, route, tokenIn, tokenOut, deadline } = trade


    console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenIn.decimals ) } ${ tokenIn.symbol } 
    for ${  ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

    const txArgs: SwapExactTokensForETH = { 
        amountIn: amountIn, 
        amountOutMin: amountOutMin, 
        routes: [ route ], 
        to: signer.address, 
        deadline: deadline 
    }
    const nonce = await signer.getNonce()

    const tx = await Router.swapExactTokensForETH( ...Object.values( txArgs ), { nonce: nonce } )
    const receipt = await tx.wait()

    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')
}


export const swapExactTokensForTokens = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountOut, amountOutMin, route, tokenIn, tokenOut, deadline } = trade

    console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenIn.decimals ) } ${ tokenIn.symbol } 
    for ${  ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

    const txArgs: SwapExactTokensForTokens = { 
        amountIn: amountIn, 
        amountOutMin: amountOutMin!, 
        routes: [ route ], 
        to: signer.address, 
        deadline 
    }
    const nonce = await signer.getNonce()

    const tx = await Router.swapExactTokensForTokens( ...Object.values( txArgs ), { nonce: nonce } )
    const receipt = await tx.wait()

    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')
}