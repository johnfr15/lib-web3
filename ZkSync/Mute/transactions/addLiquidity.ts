import { ethers, Contract, Wallet, TransactionResponse, TransactionReceipt } from "ethers";
import { is_native } from "../utils";
import { ROUTER_ADDRESS, MUTE_ROUTER_ABI, TICKER } from "../config/constants";
import { AddLiquidity } from "../types";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_add_liquidity = async( addLiquidity: AddLiquidity, signer: Wallet ): Promise<TransactionReceipt> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined
    let args: any
    let fees: bigint

    const { tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline, feeType, stable, network } = addLiquidity
    const Router: Contract = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer ) 


    console.log(`\t3) Adding liquidity for pool ${ TICKER[ tokenA.address ] }/${ TICKER[ tokenB.address ] }` )     

    if ( is_native( addLiquidity.tokenA.address ) || is_native( addLiquidity.tokenB.address ) )
    {
        let token              = is_native( tokenA.address ) ? tokenB.address : tokenA.address
        let amountTokenDesired = is_native( tokenA.address ) ? amountBDesired : amountADesired
        let amountTokenMin     = is_native( tokenA.address ) ? amountBMin : amountAMin
        let amountETHMin       = is_native( tokenA.address ) ? amountAMin : amountBMin
        let value              = is_native( tokenA.address ) ? amountADesired : amountBDesired

        args = [ token, amountTokenDesired, amountTokenMin, amountETHMin, to, deadline, feeType, stable ]
        fees = await Router.addLiquidityETH.estimateGas( ...args, { value: value } )
        
        tx = await Router.addLiquidityETH( ...args, { value: value, maxPriorityFeePerGas: fees } )
    }
    else 
    {
        args = [ tokenA.address, tokenB.address, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline, feeType, stable ]
        fees = await Router.addLiquidity.estimateGas( ...args )

        tx = await Router.addLiquidity( ...args, { maxPriorityFeePerGas: fees })
    }

    receipt = await signer.provider?.waitForTransaction( tx.hash )
        
    console.log("Transaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt as TransactionReceipt
}

