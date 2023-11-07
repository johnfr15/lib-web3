import { is_native } from "../utils";
import { TICKER } from "../../config/constants";
import { ethers, TransactionResponse, TransactionReceipt } from "ethers";
import { AddLiquidity, AddLiquidityETH, AddLiquidityTx } from "../../types";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_add_liquidity = async( addLiquidity: AddLiquidityTx ): Promise<TransactionReceipt> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined
    let args: AddLiquidity | AddLiquidityETH
    let fees: bigint

    const { tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline, Router } = addLiquidity

    console.log(`\n\nAdding liquidity for pool ${ TICKER[ tokenA.address ] }/${ TICKER[ tokenB.address ] }` )     

    if ( is_native( addLiquidity.tokenA.address ) || is_native( addLiquidity.tokenB.address ) )
    {
        let token              = is_native( tokenA.address ) ? tokenB.address : tokenA.address
        let amountTokenDesired = is_native( tokenA.address ) ? amountBDesired : amountADesired
        let amountTokenMin     = is_native( tokenA.address ) ? amountBMin : amountAMin
        let amountETHMin       = is_native( tokenA.address ) ? amountAMin : amountBMin
        let value              = is_native( tokenA.address ) ? amountADesired : amountBDesired

        args = { token, amountTokenDesired, amountTokenMin, amountETHMin, to, deadline } as AddLiquidityETH
        fees = await Router.addLiquidityETH.estimateGas( args, { value: value } )

        tx = await Router.addLiquidityETH( args, { value: value, maxPriorityFeePerGas: fees } )
    }
    else 
    {
        args = { 
            tokenA: tokenA.address, 
            tokenB: tokenB.address, 
            amountADesired, 
            amountBDesired, 
            amountAMin, 
            amountBMin, 
            to, 
            deadline 
        } as AddLiquidity
        fees = await Router.addLiquidity.estimateGas( args )

        tx = await Router.addLiquidity( args, { maxPriorityFeePerGas: fees })
    }

    receipt = await tx.wait()
        
    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt as TransactionReceipt
}

