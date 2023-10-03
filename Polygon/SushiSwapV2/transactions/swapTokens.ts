import { ethers } from "ethers";
import { SwapExactTokensForTokens, SwapTokensForExactTokens, SwapTx } from "../types";


export const swapExactTokensForTokens = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountOut, amountOutMin, path, tokenFrom, tokenTo, deadline } = trade

    try {

        console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenFrom.decimals ) } ${ tokenFrom.symbol } for ${  ethers.formatUnits( amountOut, tokenTo.decimals ) } ${ tokenTo.symbol }...`)      

        const txArgs: SwapExactTokensForTokens = { amountIn, amountOutMin, path, to: signer.address, deadline }
        const nonce = await signer.getNonce()

        const tx = await Router.swapExactTokensForTokens( ...Object.values( txArgs ), { nonce: nonce } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}

export const swapTokensForExactTokens = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountInMax, amountOut, path, tokenFrom, tokenTo, deadline } = trade

    try {

        console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenFrom.decimals ) } ${ tokenFrom.symbol } for ${  ethers.formatUnits( amountOut, tokenTo.decimals ) } ${ tokenTo.symbol }...`)      

        const txArgs: SwapTokensForExactTokens = { amountOut, amountInMax, path, to: signer.address, deadline }
        const nonce = await signer.getNonce()

        const tx = await Router.swapTokensForExactTokens(  ...Object.values( txArgs ), { nonce: nonce } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}