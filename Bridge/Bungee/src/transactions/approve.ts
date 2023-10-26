import { TransactionReceipt, ethers, Contract } from "ethers"
import { BridgeTx } from "../../type/types"
import { ERC20_ABI } from "../../config/constants"

export const exec_approve = async( brideTx: BridgeTx ): Promise<TransactionReceipt | undefined> => {

    const { approvalData } = brideTx.routeTx

    if ( approvalData === null ) 
        return


    const { signer, fromToken } = brideTx
    const { minimumApprovalAmount, approvalTokenAddress, allowanceTarget } = approvalData

    try {

        console.log(`\n\nApproving ${ allowanceTarget } to spend ${ ethers.formatUnits( minimumApprovalAmount, fromToken.decimals )  } ${ fromToken.symbol }...`)

        const Erc20 = new Contract( approvalTokenAddress as string, ERC20_ABI, signer )

        const nonce = await signer.getNonce()
        const feedata = await signer.provider?.getFeeData()
        const gasPrice = feedata!.gasPrice! * BigInt( 10 ) / BigInt( 8 )

        const tx = await Erc20.approve( allowanceTarget, minimumApprovalAmount, { nonce, gasPrice } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

        return receipt as TransactionReceipt
        
    } catch (error) {
        
        throw( error )
    }
}