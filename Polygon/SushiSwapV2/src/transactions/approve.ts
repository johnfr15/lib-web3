import { ApproveTx } from "../../types"
import { V2_ROUTER, TICKER } from "../../config/constants"
import { TransactionResponse, TransactionReceipt, Wallet, ethers } from "ethers"

export const exec_approve = async( approveTx: ApproveTx | undefined, signer: Wallet ): Promise<TransactionReceipt | undefined> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    if ( approveTx === undefined ) 
        return

    const { Erc20, spender, amount, decimals } = approveTx

    try {

        console.log(`\n\nApproving ${ V2_ROUTER } to spend ${ ethers.formatUnits( amount, decimals )  } ${ TICKER[ await Erc20.getAddress() ] ?? 'LP' }...`)

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