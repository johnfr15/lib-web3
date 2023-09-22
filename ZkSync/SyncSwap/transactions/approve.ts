import { TransactionResponse, TransactionReceipt, Wallet, ethers } from "ethers"
import { ROUTER_ADDRESS, TICKER } from "../config/constants"
import { ApproveTx } from "../types"

export const exec_approve = async( approveTx: ApproveTx | undefined, signer: Wallet ): Promise<TransactionReceipt | void> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    if ( approveTx === undefined )
        return

    const { Erc20, spender, amount, decimals, network } = approveTx

    try {

        console.log(`1) Approving ${ ROUTER_ADDRESS[ network ] } to spend ${ ethers.formatUnits( amount, decimals ) } ${ TICKER[ await Erc20.getAddress() ] ?? "LP" }...`)

        tx = await Erc20.approve( spender, amount )
        receipt = await tx.wait()

        console.log("Transaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

        return receipt as TransactionReceipt
        
    } catch (error) {
        
        throw( error )
    }
}