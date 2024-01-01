import { AddLiquidity } from "../../types";
import { ROUTER_ADDRESS, ROUTER_ABI, TICKER } from "../../config/constants";
import { ethers, Contract, Wallet, TransactionResponse, TransactionReceipt } from "ethers";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_add_liquidity = async( addLiquidity: AddLiquidity, signer: Wallet ): Promise<TransactionReceipt> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    const { pool, inputs, data, minLiquidity, callback, value, callbackData, tokenA, tokenB, network } = addLiquidity
    const Router: Contract = new Contract( ROUTER_ADDRESS[ network ], ROUTER_ABI, signer ) 


    console.log(`\nAdding liquidity for pool ${ TICKER[ tokenA.address ] }/${ TICKER[ tokenB.address ] }` )     
    

    tx = await Router.addLiquidity(
        pool,
        inputs,
        data,
        minLiquidity, 
        callback,
        callbackData,
        { value: value }
    )

    receipt = await signer.provider?.waitForTransaction( tx.hash )
        
    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt as TransactionReceipt
}