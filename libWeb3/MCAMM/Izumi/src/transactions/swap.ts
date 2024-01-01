import { ethers } from "ethers";
import { SwapTx, TradeType, SwapAmountParams, SwapDesireParams } from "../../types/swap";
import { is_native } from "../utils";


export const exec_swap = async( swapTx: SwapTx ): Promise<void> => {

    const { path, tradeType } = swapTx.trade
    const { EXACT_INPUT, EXACT_OUTPUT } = TradeType

    try {

        if ( path.length === 2 && tradeType === EXACT_INPUT )  await swapAmount( swapTx )
        if ( path.length === 2 && tradeType === EXACT_OUTPUT ) await swapDesire( swapTx )
        
    } catch (error) {

       throw( error )

    }
}


export const swapAmount = async( swapTx: SwapTx ): Promise<void> => {
    
    const { signer, trade, Swap } = swapTx
    const { pathEncoded, amountIn, amountOut, amountOutMin, tokenIn, tokenOut, deadline, chain } = trade
    const value = is_native( tokenIn.address, chain ) ? amountIn : BigInt( 0 )

    try {

        console.log(`\n\nSwapping exact ${ ethers.formatUnits( amountIn, tokenIn.decimals ) } ${ tokenIn.symbol } for ${ ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

        const txArgs: SwapAmountParams = { 
            path: pathEncoded,
            recipient: signer.address,
            amount: amountIn,
            minAcquired: amountOutMin!,
            deadline: deadline,
        }
        const nonce = await signer.getNonce()

        const tx = await Swap.swapAmount( txArgs, { value: value, nonce: nonce } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}

export const swapDesire = async( swapTx: SwapTx ): Promise<void> => {

    const { signer, trade, Swap } = swapTx
    const { pathEncoded, amountIn, amountInMax, amountOut, tokenIn, tokenOut, deadline, chain } = trade
    const value = is_native( tokenIn.address, chain ) ? amountInMax : BigInt( 0 )

    try {
        
        console.log(`\n\nSwapping ${ ethers.formatUnits( amountIn, tokenIn.decimals ) } ${ tokenIn.symbol } for ${  ethers.formatUnits( amountOut, tokenOut.decimals ) } ${ tokenOut.symbol }...`)      

        const txArgs: SwapDesireParams = { 
            path: pathEncoded,
            recipient: signer.address,
            desire: amountIn,
            maxPayed: amountInMax!,
            deadline: deadline,
        }
        const nonce = await signer.getNonce()

        const tx = await Swap.swapDesire( txArgs, { value: value, nonce: nonce } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}