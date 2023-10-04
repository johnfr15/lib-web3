import { TransactionResponse, TransactionReceipt, Wallet, ethers } from "ethers"
import { SWAP_ROUTER } from "../config/constants"
import { ApproveTx } from "../types"

export const exec_approve = async( approveTx: ApproveTx | undefined): Promise<TransactionReceipt | undefined> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    if ( approveTx === undefined ) 
        return

    const { signer, Erc20, token, chain, spender, amount } = approveTx

    try {

        console.log(`\n\nApproving ${ SWAP_ROUTER[ chain ] } to spend ${ ethers.formatUnits( amount, token.decimals )  } ${ token.symbol ?? 'LP' }...`)

        const nonce = await signer.getNonce()
        // const feePerGas = await Erc20.approve.estimateGas( spender, amount, { nonce: nonce } )
        const feedata = await signer.provider?.getFeeData()
        

        tx = await Erc20.approve( spender, amount, { nonce: nonce, gasPrice: feedata!.gasPrice! * BigInt( 10 ) / BigInt( 5 ) } )
        receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

        return receipt as TransactionReceipt
        
    } catch (error) {
        
        throw( error )
    }
}