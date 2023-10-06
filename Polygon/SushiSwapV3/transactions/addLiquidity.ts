import { ethers } from "ethers";
import { AddLiquidityTx } from "../types";
import { is_native } from "../utils";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_add_liquidity = async( addLiqTx: AddLiquidityTx ): Promise<void> => {

    const { signer, tokenA, tokenB, fee, tickLower, tickUpper, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline, chain, NftManager } = addLiqTx
    const nonce = await signer.getNonce()
    let value: bigint = BigInt( 0 )

    if ( is_native( tokenA.address, chain ) || is_native( tokenB.address, chain ) )
        value = is_native( tokenA.address, chain ) ? amountADesired : amountBDesired

    console.log(`\n\nAdding liquidity for pool ${ tokenA.symbol }/${ tokenB.symbol }` )     

    const args = {
        token0: tokenA.address,
        token1: tokenB.address,
        fee: fee,
        tickLower: tickLower,
        tickUpper: tickUpper,
        amount0Desired: amountADesired,
        amount1Desired: amountBDesired,
        amount0Min: amountAMin,
        amount1Min: amountBMin,
        recipient: signer.address,
        deadline: deadline,
    }

    const tx = await NftManager.mint( args, { nonce: nonce, value: value } )   
    const receipt = await tx.wait()
        
    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt
}

