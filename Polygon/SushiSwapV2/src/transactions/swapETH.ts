import { ethers } from "ethers";
import { enforce_swap_fees } from "../utils/swap";
import { SwapExactETHForTokens, SwapETHForExactTokens, SwapExactTokensForETH, SwapTokensForExactETH, SwapTx } from "../../types";

export const swapExactETHForTokens = async( swapTx: SwapTx ): Promise<void> => {
    
    const { signer, trade, Router } = swapTx
    let { amountIn, amountOut, amountOutMin, path, tokenFrom, tokenTo, deadline } = trade

    try {
        console.log(`\n\nSwapping exact ${ ethers.formatEther( amountIn ) } ${ tokenFrom.symbol } for ${  ethers.formatUnits( amountOut, tokenTo.decimals ) } ${ tokenTo.symbol }...`)      

        let txArgs: SwapExactETHForTokens = { amountOutMin, path, to: signer.address, deadline }
        const { value, tx: enforce_args } = await enforce_swap_fees( swapTx, txArgs )

        const nonce = await signer.getNonce()

        const tx = await Router.swapExactETHForTokens(  ...Object.values( enforce_args ), { value: value, nonce: nonce } )
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

        let txArgs: SwapETHForExactTokens = { amountOut, path, to: signer.address, deadline }
        const { value, tx: enforce_args } = await enforce_swap_fees( swapTx, txArgs )

        const nonce = await signer.getNonce()

        const tx = await Router.swapETHForExactTokens( ...Object.values( enforce_args ), { value: value, nonce: nonce } )
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

        console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenFrom.decimals ) } ${ tokenFrom.symbol } for ${  ethers.formatUnits( amountOut, tokenTo.decimals ) } ${ tokenTo.symbol }...`)      

        const txArgs: SwapExactTokensForETH = { amountIn, amountOutMin, path, to: signer.address, deadline }
        const nonce = await signer.getNonce()

        const tx = await Router.swapExactTokensForETH( ...Object.values( txArgs ), { nonce: nonce } )
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

        console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenFrom.decimals ) } ${ tokenFrom.symbol } for ${  ethers.formatUnits( amountOut, tokenTo.decimals ) } ${ tokenTo.symbol }...`)      

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