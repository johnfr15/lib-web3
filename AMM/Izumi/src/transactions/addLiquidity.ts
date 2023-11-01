import { ethers } from "ethers";
import { is_native } from "../utils";
import { MintParam, AddLiquidityParam, AddLiquidityTx } from "../../types/add";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_add_liquidity = async( addLiqTx: AddLiquidityTx ): Promise<void> => {

    if ( addLiqTx.liquidity )
        await addLiquidity( addLiqTx )
    else
        await mint( addLiqTx )
}

const mint = async( addLiqTx: AddLiquidityTx ) => {

    const { signer, tokenX, tokenY, fee, pl, pr, amountADesired, amountBDesired, amountAMin, amountBMin, deadline, chain, NftManager } = addLiqTx
    let value: bigint = BigInt( 0 )

    if ( is_native( tokenX.address, chain ) || is_native( tokenY.address, chain ) )
        value = is_native( tokenX.address, chain ) ? amountADesired : amountBDesired

    try {

        console.log(`\n\nMinting liquidity for pool ${ tokenX.symbol }/${ tokenY.symbol }` )     
        
        const args: MintParam = {
            miner: signer.address,
            tokenX: tokenX.address,
            tokenY: tokenY.address,
            fee: fee,
            pl: pl,
            pr: pr,
            xLim: amountADesired,
            yLim: amountBDesired,
            amountXMin: amountAMin,
            amountYMin: amountBMin,
            deadline: deadline,
        }
        const nonce = await signer.getNonce()
        
        const tx = await NftManager.mint( args, { nonce: nonce, value: value } )   
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

    const { signer, tokenX, tokenY, deadline, chain, NftManager } = addTx
    const { liquidity, amountADesired, amountBDesired, amountAMin, amountBMin } = addTx

    let value: bigint = BigInt( 0 )

    if ( is_native( tokenX.address, chain ) || is_native( tokenY.address, chain ) )
        value = is_native( tokenX.address, chain ) ? amountADesired : amountBDesired

    try {

        console.log(`\n\nIncreasing liquidity for pool ${ tokenX.symbol }/${ tokenY.symbol }...` )     
        
        const args: AddLiquidityParam = {
            lid: liquidity!.tokenId,
            xLim: amountADesired,
            yLim: amountBDesired,
            amountXMin: amountAMin,
            amountYMin: amountBMin,
            deadline: deadline,
        }
        const nonce = await signer.getNonce()
    
        const tx = await NftManager.addLiquidity( args, { nonce: nonce, value: value } )   
        const receipt = await tx.wait()
            
        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))
    
        return receipt

    } catch (error) {
        
        throw( error )

    }
}