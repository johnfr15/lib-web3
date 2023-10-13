import { Contract, ethers, TransactionResponse } from "ethers";
import { SwapTx } from "../types";
import { ERC20_ABI } from "../config/constants";

export const exec_order = async( swapTx: SwapTx ) => {

    let tx: TransactionResponse
    const { senderAddress, inAmount, inSymbol, outAmount, outSymbol, receiverAddress } = swapTx.order
    const { tokenFrom, tokenTo } = swapTx.trade
    
    try {

        console.log(`\nSending from ${ tokenFrom.network.name } ${ inAmount } ${ inSymbol } to ${ senderAddress }...`)
        console.log(`        to ${ tokenTo.network.name } ${ outAmount } ${ outSymbol } to ${ receiverAddress }...`)
        
        if ( tokenFrom.address )
        {
            const Erc20 = new Contract( tokenFrom.address, ERC20_ABI, swapTx.signer )
            const decimals = await Erc20.decimals()
            const amount = ethers.parseUnits( inAmount.toString(), decimals )

            tx = await Erc20.transfer( senderAddress, amount )
        }
        else
        {
            const value = ethers.parseEther( inAmount.toString() )

            tx = await swapTx.signer.sendTransaction({ to: senderAddress, value: value })
        }

        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')
        
    } catch (error) {
        
        throw( error )

    }
}
