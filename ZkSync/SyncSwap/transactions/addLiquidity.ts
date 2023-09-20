import { ethers, Contract, Wallet, TransactionResponse, TransactionReceipt } from "ethers";
import { is_native } from "../utils";
import { ROUTER_ADDRESS, ROUTER_ABI, TICKER } from "../config/constants";
import { AddLiquidity } from "../types";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_add_liquidity = async( addLiquidity: AddLiquidity, signer: Wallet ): Promise<TransactionReceipt> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    const { tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline, feeType, stable, network } = addLiquidity
    const Router: Contract = new Contract( ROUTER_ADDRESS[ network ], ROUTER_ABI, signer ) 


    console.log(`\t3) Adding liquidity for pool ${ TICKER[ tokenA.address ] }/${ TICKER[ tokenB.address ] }` )     

    if ( is_native( addLiquidity.tokenA.address ) || is_native( addLiquidity.tokenB.address ) )
    {
        tx = await Router.addLiquidityETH([
            is_native( tokenA.address ) ? tokenB.address : tokenA.address,
            is_native( tokenA.address ) ? amountBDesired : amountADesired,
            is_native( tokenA.address ) ? amountBMin : amountAMin,
            is_native( tokenA.address ) ? amountAMin : amountBMin,
            to,
            deadline,
            feeType,
            stable
        ])
    }
    else 
    {
        tx = await Router.addLiquidity([
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            to,
            deadline,
            feeType,
            stable
        ])
    }

    receipt = await signer.provider?.waitForTransaction( tx.hash )
        
    console.log("Transaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt as TransactionReceipt
}