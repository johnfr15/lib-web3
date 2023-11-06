import { ethers } from "ethers";
import { is_native } from "../utils";
import { RemoveLiquidity, RemoveLiquidityETH, RemoveLiquidityTx } from "../../types/remove";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_remove = async( removeTx: RemoveLiquidityTx ): Promise<void> => {

    const { tokenX, tokenY } = removeTx

    if ( is_native( tokenX.address ) || is_native( tokenY.address ) )
        await removeLiquidityETH( removeTx )
    else
        await removeLiquidity( removeTx )
}

const removeLiquidityETH = async( removeTx: RemoveLiquidityTx ) => {

    const { signer, tokenX, tokenY, deadline, pool, Router } = removeTx
    const { liquidity, amountXMin, amountYMin } = removeTx

    try {

        console.log(`\n\nMinting liquidity for pool ${ tokenX.symbol }/${ tokenY.symbol }` )     
        
        const x_native = is_native( tokenX.address )

        const args: RemoveLiquidityETH = {
            token: x_native ? tokenY.address : tokenX.address,
            liquidity: liquidity.bigint,
            amountTokenMin: x_native ? amountYMin : amountXMin,
            amountETHMin: x_native ? amountXMin : amountYMin,
            to: signer.address,
            deadline: deadline,
        }
        const nonce = await signer.getNonce()
        
        const tx = await Router.removeLiquidityETH( ...Object.values( args ), { nonce: nonce } )   
        const receipt = await tx.wait()
            
        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))
    
        return receipt

    } catch (error) {
        
        throw( error )

    }
}

const removeLiquidity = async( removeTx: RemoveLiquidityTx ) => {

    const { signer, tokenX, tokenY, deadline, pool, Router } = removeTx
    const { liquidity, amountXMin, amountYMin } = removeTx

    try {

        console.log(`\n\nIncreasing liquidity for pool ${ tokenX.symbol }/${ tokenY.symbol }...` )     
        
        const args: RemoveLiquidity = {
            tokenA: tokenX.address,
            tokenB: tokenY.address,
            liquidity: liquidity.bigint,
            amountAMin: amountXMin,
            amountBMin: amountYMin,
            to: signer.address,
            deadline: deadline,
        }
        const nonce = await signer.getNonce()
    
        const tx = await Router.removeLiquidity( ...Object.values( args ), { nonce: nonce } )   
        const receipt = await tx.wait()
            
        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))
    
        return receipt

    } catch (error) {
        
        throw( error )

    }
}