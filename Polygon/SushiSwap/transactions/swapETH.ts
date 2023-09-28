import { ethers } from "ethers";
import { SwapExactETHForTokens, SwapETHForExactTokens, SwapExactTokensForETH, SwapTokensForExactETH, SwapTx } from "../types";

export const swapExactETHForTokens = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountOut, amountOutMin, path, tokenFrom, tokenTo, deadline } = trade

    try {

        console.log(`\n\nSwapping exact ${ ethers.formatEther( amountIn ) } ${ tokenFrom.symbol } for ${  ethers.formatUnits( amountOut, tokenTo.decimals ) } ${ tokenTo.symbol }...`)      

        const txArgs: SwapExactETHForTokens = { amountOutMin, path, to: signer.address, deadline }
        const nonce = await signer.getNonce()

        const tx = await Router.swapExactETHForTokens(  ...Object.values( txArgs ), { value: amountIn, nonce: nonce } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}

export const swapETHForExactTokens = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountInMax, amountOut, path, tokenFrom, tokenTo, deadline } = trade

    try {

        console.log(`\n\nSwapping ${ ethers.formatEther( amountIn ) } ${ tokenFrom.symbol } for ${  ethers.formatUnits( amountOut, tokenTo.decimals ) } ${ tokenTo.symbol }...`)      

        const txArgs: SwapETHForExactTokens = { amountOut, path, to: signer.address, deadline }
        const nonce = await signer.getNonce()

        const tx = await Router.swapETHForExactTokens( ...Object.values( txArgs ), { value: amountInMax, nonce: nonce } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}


export const swapExactTokensForETH = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountOut, amountOutMin, path, tokenFrom, tokenTo, deadline } = trade

    try {

        console.log(`\n\nSwapping exact ${ ethers.formatEther( amountIn ) } ${ tokenFrom.symbol } for ${  ethers.formatUnits( amountOut, tokenTo.decimals ) } ${ tokenTo.symbol }...`)      

        const txArgs: SwapExactTokensForETH = { amountIn, amountOutMin, path, to: signer.address, deadline }
        const nonce = await signer.getNonce()

        const tx = await Router.swapExactTokensForETH(  ...Object.values( txArgs ), { nonce: nonce } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}

export const swapTokensForExactETH = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Router } = swapTx
    const { amountIn, amountInMax, amountOut, path, tokenFrom, tokenTo, deadline } = trade

    try {

        console.log(`\n\nSwapping ${ ethers.formatEther( amountIn ) } ${ tokenFrom.symbol } for ${  ethers.formatUnits( amountOut, tokenTo.decimals ) } ${ tokenTo.symbol }...`)      

        const txArgs: SwapTokensForExactETH = { amountOut, amountInMax, path, to: signer.address, deadline }
        const nonce = await signer.getNonce()

        const tx = await Router.swapTokensForExactETH(  ...Object.values( txArgs ), { nonce: nonce } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}