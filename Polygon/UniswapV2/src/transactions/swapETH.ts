import { ethers } from "ethers"
import { SwapTx } from "../../types";
import { Fraction } from "@uniswap/sdk-core";
import { ADDRESS_THIS, MSG_SENDER } from "../../config/constants";

export const swapExactETHForTokens = async( swapTx: SwapTx ): Promise<void> => {

    let inputs: string[] = []

    const { signer, trade, deadline, Router, path, slipage } = swapTx
    const { inputAmount, outputAmount } = trade.trade

    let minAmountOut = outputAmount.multiply( new Fraction(100 - slipage, 100) ).quotient.toString()

    try {

        console.log(`\n\nSwapping exact ${ inputAmount.toExact() } ${ inputAmount.currency.symbol } for ${ outputAmount.toExact() } ${ outputAmount.currency.symbol }...`)      

        /**
         * @commands
         * @dev each command is 1 byte. See https://github.com/Uniswap/universal-router/blob/main/README.md?plain=1#L59 
         *      for all the commands available
         * 
         * - 1) 0x0b = WRAP_ETH
         * - 2) 0x00 = V3_SWAP_EXACT_IN
         */

        const commands = "0x0b00"

        /**
         * @inputs
         * @dev For all the commands specified above we need to encode their parameters respectively
         *      see Dispatcher.sol here https://github.com/Uniswap/universal-router/blob/main/contracts/base/Dispatcher.sol#L36 
         *      for how each commands decode your inputs 
         * 
         * - 1) WRAP_ETH         => https://github.com/Uniswap/universal-router/blob/main/contracts/base/Dispatcher.sol#L172C45-L172C45
         * - 2) V3_SWAP_EXACT_IN => https://github.com/Uniswap/universal-router/blob/main/contracts/base/Dispatcher.sol#L46
         */

        inputs[0] = ethers.AbiCoder.defaultAbiCoder().encode( [ "address", "uint256" ], [ ADDRESS_THIS, inputAmount.quotient.toString() ] ) 
        inputs[1] = encode_swap( inputAmount.quotient.toString(), minAmountOut, path )

        const txArgs = [ commands, inputs, deadline ]
        const nonce = await signer.getNonce()

        console.log( "nonce: ", nonce)

        const feesPerGas = await Router.execute.estimateGas( ...txArgs, { value: inputAmount.quotient.toString(), nonce: nonce } )
        const tx = await Router.execute(  ...txArgs, { value: inputAmount.quotient.toString(), nonce: nonce, maxPriorityFeePerGas: feesPerGas * BigInt( 2 ) } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}

export const swapETHForExactTokens = async( swapTx: SwapTx ): Promise<void> => {

    let inputs: string[] = []

    const { trade, deadline, Router, path, slipage } = swapTx
    const { inputAmount, outputAmount, maximumAmountIn, minimumAmountOut } = trade.trade

    let slipageTolerance = ( slipage  + 100 ) * 100
    let maxIn = inputAmount.multiply( new Fraction( slipageTolerance, 100 * 100 ) ).quotient.toString()

    try {

        console.log(`\n\nSwapping ${ inputAmount.toExact() } ${ inputAmount.currency.symbol } for exact ${ outputAmount.toExact() } ${ outputAmount.currency.symbol }...`)      

        /**
         * @commands
         * @dev each command is 1 byte. See https://github.com/Uniswap/universal-router/blob/main/README.md?plain=1#L59 
         *      for all the commands available
         * 
         * - 1) 0x0b = WRAP_ETH
         * - 2) 0x01 = V3_SWAP_EXACT_OUT
         * - 3) 0x0c = UNWRAP_WETH
         */

        const commands = "0x0b010c"

        /**
         * @inputs
         * @dev For all the commands specified above we need to encode their parameters respectively
         *      see Dispatcher.sol here https://github.com/Uniswap/universal-router/blob/main/contracts/base/Dispatcher.sol#L36 
         *      for how each commands decode your inputs 
         * 
         * - 1) WRAP_ETH          => https://github.com/Uniswap/universal-router/blob/main/contracts/base/Dispatcher.sol#L172C45-L172C45
         * - 2) V3_SWAP_EXACT_OUT => https://github.com/Uniswap/universal-router/blob/main/contracts/base/Dispatcher.sol#L62
         * - 2) UNWRAP_WETH       => https://github.com/Uniswap/universal-router/blob/main/contracts/base/Dispatcher.sol#L182
         */

        inputs[0] = ethers.AbiCoder.defaultAbiCoder().encode( [ "address", "uint256" ], [ ADDRESS_THIS, maxIn ] ) 
        inputs[1] = encode_swap( outputAmount.quotient.toString(), maxIn, [ path[1], path[0] ] ) // We need to reverse the path
        inputs[2] = ethers.AbiCoder.defaultAbiCoder().encode( [ "address", "uint256" ], [ MSG_SENDER, BigInt( 0 ) ] )

        // console.log( inputs[1] )
        // return
        const txArgs = [ commands, inputs, deadline ]

        // const feesPerGas = await Router.execute.estimateGas( ...txArgs, { value: maxIn } )
        const tx = await Router.execute(  ...txArgs, { value: maxIn } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}


const encode_swap = ( inputAmount: string, outputAmount: string, path: [string, string] ): string => {

    let input: string = ethers.AbiCoder.defaultAbiCoder().encode( 
        [ "address", "uint256", "uint256", "bytes", "bool" ], 
        [ MSG_SENDER, inputAmount, outputAmount, "0x", false ] 
    ) 

    // here we remove the last (32 bytes) slot and append the "encoded" path so uniswap V3Path.sol can decode it his way
    input = input.substring( 0, input.length - 64 )
    input = input + encode_path( path )

    return input
}

const encode_path = ( path: [string, string] ): string => {

    let fee: string = '000064'
    let concat_path: string = path[0].substring(2) + fee + path[1].substring(2)
    let length: string = "000000000000000000000000000000000000000000000000000000000000002b"

    while ( concat_path.length < 128 )
        concat_path += '0'

    return length + concat_path
}