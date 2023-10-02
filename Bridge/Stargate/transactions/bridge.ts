import { TransactionResponse, TransactionReceipt, ethers } from "ethers"
import { BridgeTx } from "../types"

export const exec_bridge = async( bridgeTx: BridgeTx ): Promise<TransactionReceipt | undefined> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    const { signer, Router, payload, messageFee, utils } = bridgeTx
    const { native, tokenIn, fromChain, toChain } = utils

    try {

        console.log(`\nBridge ${ ethers.formatUnits( payload.amount, tokenIn.decimals ) } ${ tokenIn.symbol }`)
        console.log(`\tFrom ${ fromChain }`)
        console.log(`\tTo   ${ toChain }`)
        console.log("\nMessage fees: ", ethers.formatEther( messageFee ), native.symbol)

        const nonce = await signer.getNonce()
        const feedata = await signer.provider?.getFeeData()
        
        tx = await Router.swap( 
            ...Object.values( payload ), 
            { nonce: nonce, gasPrice: feedata!.gasPrice! * BigInt( 10 ) / BigInt( 8 ), value: messageFee } 
        )
        receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ), native.symbol)

        return receipt as TransactionReceipt
        
    } catch (error) {
        
        throw( error )
    }
}