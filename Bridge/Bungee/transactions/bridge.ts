import { TransactionReceipt, ethers } from "ethers"
import { BridgeTx } from "../type/types"

export const exec_bridge = async( bridgeTx: BridgeTx ) => {

    const { signer, fromToken, toToken, fromChain, toChain, amount, routeTx, userTx } = bridgeTx
    const { txData, txTarget, value } = routeTx


    try {

        console.log(`\nBridge`)
        console.log(`\tFrom ${ fromChain } ${ ethers.formatUnits( amount, fromToken.decimals ) } ${ fromToken.symbol }`)
        console.log(`\tTo   ${ toChain } ${ ethers.formatUnits( userTx.toAmount, toToken.decimals ) } ${ toToken.symbol }`)

        const nonce = await signer.getNonce()
        const feedata = await signer.provider?.getFeeData()
        const gasPrice = feedata!.gasPrice! * BigInt( 10 ) / BigInt( 8 )

        const tx = await signer.sendTransaction({ 
            to: txTarget, 
            data: txData, 
            value: value, 
            nonce: nonce, 
            gasPrice: gasPrice 
        })
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

        return receipt as TransactionReceipt

    } catch (error) {
                
        throw( error )

    }
}