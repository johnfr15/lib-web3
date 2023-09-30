import { TransactionResponse, TransactionReceipt, ethers } from "ethers"
import { BridgeTx } from "../types"
import { resolve_provider } from "../utils"
import { STARGATE_CHAIN_ID } from "../config/constants"

export const exec_bridge = async( bridgeTx: BridgeTx ): Promise<TransactionReceipt | undefined> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    const { signer, SushiXSwapV2, fromChain, toChain, bridge, tokenIn } = bridgeTx

    try {

        console.log(`\nBridge ${ ethers.formatUnits( bridgeTx.bridge.bridgeParams.amountIn, tokenIn.decimals ) } ${ tokenIn.symbol }`)
        console.log(`\tFrom ${ fromChain }`)
        console.log(`\tTo   ${ toChain }`)

        const nonce = await signer.getNonce()
        const feedata = await signer.provider?.getFeeData()
        
    
        tx = await SushiXSwapV2.bridge( 
            ...Object.values( bridge ), 
            { nonce: nonce, gasPrice: feedata!.gasPrice! * BigInt( 10 ) / BigInt( 8 ) } 
        )
        receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

        return receipt as TransactionReceipt
        
    } catch (error) {
        
        throw( error )
    }
}