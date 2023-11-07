import { ApproveTx } from "../../types";
import { TICKER } from "../../config/constants";
import { TransactionResponse, TransactionReceipt, Wallet, ethers } from "ethers";

export const exec_approve = async( approveTx: ApproveTx | undefined, signer: Wallet ): Promise<TransactionReceipt | undefined> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    if ( approveTx === undefined ) 
        return

    const { Erc20, spender, amount, decimals } = approveTx

    try {

        console.log(`\n\nApproving ${ spender } to spend ${ ethers.formatUnits( amount, decimals )  } ${ TICKER[ await Erc20.getAddress() ] ?? 'LP' }...`)

        tx = await Erc20.approve( spender, amount * BigInt( 2 ) )
        receipt = await signer.provider?.waitForTransaction( tx.hash )

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

        return receipt as TransactionReceipt
        
    } catch (error) {
        
        throw( error )
    }
}

