import { is_native } from "../utils";
import { BridgeTx } from "../../types";
import { is_router_eth } from "../utils/bridge";
import { TransactionReceipt, ethers } from "ethers";

export const exec_bridge = async( bridgeTx: BridgeTx ) => {

    const { tokenIn, fromChain  } = bridgeTx.utils

    if ( is_router_eth( tokenIn, fromChain ) )
    {
        await swapETH( bridgeTx )
    }
    else
    {
        await swap( bridgeTx )
    }
}

const swap = async( bridgeTx: BridgeTx ): Promise<TransactionReceipt | undefined> => {

    const { signer, Router, payload, messageFee, utils } = bridgeTx
    const { tokenIn, fromChain, toChain } = utils

    const value = is_native( tokenIn.address, fromChain ) ? payload.amount : BigInt( 0 )

    try {

        console.log(`\nBridge ${ ethers.formatUnits( payload.amount, tokenIn.decimals ) } ${ tokenIn.symbol }`)
        console.log(`\tFrom ${ fromChain }`)
        console.log(`\tTo   ${ toChain }`)
        console.log("\nMessage fees: ", ethers.formatEther( messageFee ), 'ETH')

        const nonce = await signer.getNonce()
        const feedata = await signer.provider?.getFeeData()
        
        const gasLimit = await Router.swap.estimateGas( 
            ...Object.values( payload ), 
            { nonce: nonce, value: messageFee + value } 
        )

        const tx = await Router.swap( ...Object.values( payload ), 
            { 
                nonce: nonce, 
                gasPrice: feedata!.gasPrice! * BigInt( 10 ) / BigInt( 8 ),
                gasLimit: gasLimit,
                value: messageFee + value
            } 
        )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

        return receipt as TransactionReceipt

    } catch (error) {
                
        throw( error )

    }
}

const swapETH = async( bridgeTx: BridgeTx ): Promise<TransactionReceipt | undefined> => {

    const { signer, Router, payload, messageFee, utils } = bridgeTx
    const { tokenIn, fromChain, toChain } = utils

    const { dstChainId, refundAddress, to, amount, amountMin } = payload

    try {

        const value = is_native( tokenIn.address, fromChain ) ? payload.amount : BigInt( 0 )

        console.log(`\nBridge ${ ethers.formatUnits( payload.amount, tokenIn.decimals ) } ${ tokenIn.symbol }`)
        console.log(`\tFrom ${ fromChain }`)
        console.log(`\tTo   ${ toChain }`)
        console.log("\nMessage fees: ", ethers.formatEther( messageFee ))

        const nonce = await signer.getNonce()
        const gasLimit = await Router.swapETH.estimateGas( dstChainId, refundAddress, to, amount, amountMin, 
            { nonce: nonce, value: messageFee + value }
        ) 
            
        const tx = await Router.swapETH( 
            dstChainId,
            refundAddress,
            to,
            amount,
            amountMin,
            { nonce: nonce, value: messageFee + value, gasLimit: gasLimit }
        )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

        return receipt as TransactionReceipt
    
    } catch (error) {
                
        throw( error )

    }
}
