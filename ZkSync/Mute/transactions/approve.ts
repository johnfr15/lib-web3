import { TransactionResponse } from "ethers"

export const exec_approve = async( approveTx: any ): Promise<TransactionResponse> => {

    const { Erc20, spender, amount } = approveTx

    try {

        const tx = await Erc20.approve( spender, amount )

        return tx
        
    } catch (error) {
        
        throw( error )
    }
}