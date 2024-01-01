import { ethers } from "ethers";
import { RemoveLiquidityTx, DecreaseLiquidity, Collect } from "../../types/remove";
import { MAX_UINT128 } from "../../config/constants"

export const exec_decrease = async( removeLiq: RemoveLiquidityTx ) => {

    const { signer, token0, token1, position, amountXMin, amountYMin, deadline, percent, NftManager } = removeLiq


    console.log(`\n\nDecreasing ${ percent }% of liquidity for:\n\t\
        (minimum)${ ethers.formatUnits( amountXMin, token0.decimals ) } ${ token0.symbol }\n\t\
        (minimum)${ ethers.formatUnits( amountYMin, token1.decimals ) } ${ token1.symbol }
    `)

    const txArgs: DecreaseLiquidity = {
        lid: position.tokenId,
        liquidDelta: position.liquidity,
        amountXMin: amountXMin,
        amountYMin: amountYMin,
        deadline: deadline,
    }

    const nonce = await signer.getNonce()
    const feedata = await signer.provider?.getFeeData()!
    const gasPrice = feedata.gasPrice! * BigInt( 100 ) / BigInt( 90 )
    const gasLimit = await NftManager.decLiquidity.estimateGas( ...Object.values( txArgs ), { nonce: nonce, gasPrice: gasPrice }) * BigInt( 2 )

    const tx = await NftManager.decLiquidity( ...Object.values( txArgs ), { nonce: nonce, gasPrice: gasPrice, gasLimit: gasLimit })
    const receipt = await tx.wait()
        
    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt
}

export const exec_collect = async( removeLiq: RemoveLiquidityTx ) => {

    const { signer, token0, token1, position, amount0, amount1, percent, NftManager } = removeLiq


    console.log(`\n\nCollecting ${ percent }% of liquidity for:\n\t\
        ${ ethers.formatUnits( amount0, token0.decimals ) } ${ token0.symbol }\n\t\
        ${ ethers.formatUnits( amount1, token1.decimals ) } ${ token1.symbol }
    `)

    const txArgs: Collect = {
        recipient: signer.address,
        lid: position.tokenId,
        amountXLim: MAX_UINT128,
        amountYLim: MAX_UINT128,
    }
    const nonce = await signer.getNonce()

    const tx = await NftManager.collect( ...Object.values( txArgs ), { nonce: nonce } )
    const receipt = await tx.wait()
        
    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt
}