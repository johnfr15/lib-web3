import { is_native } from "../utils";
import { V2_ROUTER, V2_ROUTER_ABI } from "../../config/constants";
import { AddLiquidity, AddLiquidityETH, AddLiquidityTx } from "../../types";
import { ethers, Contract, TransactionResponse, TransactionReceipt } from "ethers";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_add_liquidity = async( addLiqTx: AddLiquidityTx ): Promise<TransactionReceipt> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined
    let txArgs: AddLiquidityETH | AddLiquidity

    const { signer, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline } = addLiqTx
    const Router: Contract = new Contract( V2_ROUTER, V2_ROUTER_ABI, signer ) 
    const nonce = await signer.getNonce()

    console.log(`\n\nAdding liquidity for pool ${ tokenA.symbol }/${ tokenA.symbol }` )     

    if ( is_native( addLiqTx.tokenA.address ) || is_native( addLiqTx.tokenB.address ) )
    {
        let token              = is_native( tokenA.address ) ? tokenB.address : tokenA.address
        let amountTokenDesired = is_native( tokenA.address ) ? amountBDesired : amountADesired
        let amountTokenMin     = is_native( tokenA.address ) ? amountBMin : amountAMin
        let amountETHMin       = is_native( tokenA.address ) ? amountAMin : amountBMin
        let value              = is_native( tokenA.address ) ? amountADesired : amountBDesired

        txArgs = { token, amountTokenDesired, amountTokenMin, amountETHMin, to, deadline } as AddLiquidityETH

        tx = await Router.addLiquidityETH( ...Object.values( txArgs ), { value: value, nonce: nonce } )
    }
    else 
    {
        txArgs = { 
            tokenA: tokenA.address, 
            tokenB: tokenB.address, 
            amountADesired, 
            amountBDesired, 
            amountAMin, 
            amountBMin, 
            to, 
            deadline 
        } as AddLiquidity

        tx = await Router.addLiquidity( ...Object.values( txArgs ), { nonce: nonce })
    }

    receipt = await tx.wait()
        
    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt as TransactionReceipt
}

