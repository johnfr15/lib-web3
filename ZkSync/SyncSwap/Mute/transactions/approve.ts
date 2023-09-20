import { TransactionResponse, TransactionReceipt, Wallet, ethers } from "ethers"
import { ROUTER_ADDRESS, TICKER } from "../config/constants"
import { ApproveTx } from "../types"

export const exec_approve = async( approveTx: ApproveTx, signer: Wallet ): Promise<TransactionReceipt> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined
    const { Erc20, spender, amount, network } = approveTx

    try {

        console.log(`1) Approving ${ ROUTER_ADDRESS[ network ] } to spend ${ amount } ${ TICKER[ await Erc20.getAddress() ] }...`)

        tx = await Erc20.approve( spender, amount )
        receipt = await signer.provider?.waitForTransaction( tx.hash )

        console.log("Transaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

        return receipt as TransactionReceipt
        
    } catch (error) {
        
        throw( error )
    }
}