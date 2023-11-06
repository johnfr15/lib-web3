import { ethers } from "ethers";
import { is_native } from "../utils";
import { AddLiquidityTx, AddLiquidity, AddLiquidityETH } from "../../types/add";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_add_liquidity = async( addLiqTx: AddLiquidityTx ): Promise<void> => {

    const { tokenX, tokenY } = addLiqTx

    if ( is_native( tokenX.address ) || is_native( tokenY.address ) )
        await addLiquidityETH( addLiqTx )
    else
        await addLiquidity( addLiqTx )
}

const addLiquidityETH = async( addTx: AddLiquidityTx ) => {

    const { signer, tokenX, tokenY, deadline, pool, Router } = addTx
    const { amountXDesired, amountYDesired, amountXMin, amountYMin } = addTx

    let value: bigint = BigInt( 0 )

    if ( is_native( tokenX.address ) || is_native( tokenY.address ) )
        value = is_native( tokenX.address ) ? amountXDesired : amountYDesired

    try {

        console.log(`\n\nMinting liquidity for pool ${ tokenX.symbol }/${ tokenY.symbol }` )     
        
        const x_native = is_native( tokenX.address )

        const args: AddLiquidityETH = {
            token: x_native ? tokenY.address : tokenX.address,
            amountTokenDesired: x_native ? amountYDesired : amountXDesired,
            amountTokenMin: x_native ? amountYMin : amountXMin,
            amountETHMin: x_native ? amountXMin : amountYMin,
            to: signer.address,
            deadline: deadline,
        }
        const nonce = await signer.getNonce()
        
        const tx = await Router.addLiquidityETH( ...Object.values( args ), { nonce: nonce, value: value } )   
        const receipt = await tx.wait()
            
        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))
    
        return receipt

    } catch (error) {
        
        throw( error )

    }
}

const addLiquidity = async( addTx: AddLiquidityTx ) => {

    const { signer, tokenX, tokenY, deadline, pool, Router } = addTx
    const { amountXDesired, amountYDesired, amountXMin, amountYMin } = addTx

    let value: bigint = BigInt( 0 )

    if ( is_native( tokenX.address ) || is_native( tokenY.address ) )
        value = is_native( tokenX.address ) ? amountXDesired : amountYDesired

    try {

        console.log(`\n\nIncreasing liquidity for pool ${ tokenX.symbol }/${ tokenY.symbol }...` )     
        
        const args: AddLiquidity = {
            tokenA: tokenX.address,
            tokenB: tokenY.address,
            amountADesired: amountXDesired,
            amountBDesired: amountYDesired,
            amountAMin: amountXMin,
            amountBMin: amountYMin,
            to: signer.address,
            deadline: deadline,
        }
        const nonce = await signer.getNonce()
    
        const tx = await Router.addLiquidity( ...Object.values( args ), { nonce: nonce, value: value } )   
        const receipt = await tx.wait()
            
        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))
    
        return receipt

    } catch (error) {
        
        throw( error )

    }
}