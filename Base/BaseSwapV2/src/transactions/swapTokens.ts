import { ethers } from "ethers"
import { SwapTokensForExactETH, SwapTokensForExactTokens } from "../../types/swap" 
import { SwapExactTokensForTokens, SwapExactTokensForETH, SwapTx } from "../../types/swap"

export const swapExactTokensForETH = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountOut, amountOutMin, path, tokenIn, tokenOut, deadline } = trade


    console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenIn.decimals ) } ${ tokenIn.symbol }` +
    `for ${  ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

    const txArgs: SwapExactTokensForETH = { 
        amountIn: amountIn, 
        amountOutMin: amountOutMin, 
        path: path, 
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
    const { amountIn, amountOut, amountOutMin, path, tokenIn, tokenOut, deadline } = trade

    console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenIn.decimals ) } ${ tokenIn.symbol }` + 
    `for ${ ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

    const txArgs: SwapExactTokensForTokens = { 
        amountIn: amountIn, 
        amountOutMin: amountOutMin!, 
        path: path,
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





export const swapTokensForExactETH = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountOut, amountInMax, path, tokenIn, tokenOut, deadline } = trade


    console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenIn.decimals ) } ${ tokenIn.symbol }` +
    `for ${  ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

    const txArgs: SwapTokensForExactETH = { 
        amountOut: amountOut, 
        amountInMax: amountInMax, 
        path: path, 
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





export const swapTokensForExactTokens = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountOut, amountInMax, path, tokenIn, tokenOut, deadline } = trade

    console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenIn.decimals ) } ${ tokenIn.symbol }` + 
    `for ${  ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

    const txArgs: SwapTokensForExactTokens = { 
        amountOut: amountOut, 
        amountInMax: amountInMax, 
        path: path,
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