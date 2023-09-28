import { ethers } from "ethers"
import { SwapTx } from "../types";
import { ADDRESS_THIS, MSG_SENDER } from "../config/constants";
import { Fraction, Token } from "@uniswap/sdk-core";
import { is_native } from "../utils";

export const swapExactTokensForTokens = async( swapTx: SwapTx ): Promise<void> => {

    let inputs: string[] = []

    const { signer, trade, deadline, Router, path, slipage } = swapTx
    const { inputAmount, outputAmount } = trade.trade

    let tokenPath = trade.route[0].tokenPath
    let minAmountOut = outputAmount.multiply( new Fraction( (100 - (slipage + 10)) * 100, 100 * 100) ).quotient.toString()

    console.log("input: ", inputAmount.toExact())
    console.log("min out: ", ethers.formatEther( minAmountOut ))
    try {

        console.log(`\n\nSwapping exact ${ inputAmount.toExact() } ${ inputAmount.currency.symbol } for ${ outputAmount.toExact() } ${ outputAmount.currency.symbol }...`)      

        /**
         * @commands
         * @dev each command is 1 byte. See https://github.com/Uniswap/universal-router/blob/main/README.md?plain=1#L59 
         *      for all the commands available
         * 
         * - 1) 0x00 = V3_SWAP_EXACT_IN
         * - 1) 0x0c = UNWRAP_ETH
         */

        const commands = "0x000c"

        /**
         * @inputs
         * @dev For all the commands specified above we need to encode their parameters respectively
         *      see Dispatcher.sol here https://github.com/Uniswap/universal-router/blob/main/contracts/base/Dispatcher.sol#L36 
         *      for how each commands decode your inputs 
         * 
         * - 1) V3_SWAP_EXACT_IN => https://github.com/Uniswap/universal-router/blob/main/contracts/base/Dispatcher.sol#L46
         * - 2) UNWRAP_ETH       => https://github.com/Uniswap/universal-router/blob/main/contracts/base/Dispatcher.sol#L172C45-L172C45
         */

        inputs[0] = encode_swap( inputAmount.quotient.toString(), minAmountOut, path )
        inputs[1] = ethers.AbiCoder.defaultAbiCoder().encode( [ "address", "uint256" ], [ MSG_SENDER, 0 ] ) 

        console.log( inputs[0])
        const txArgs = [ commands, inputs, deadline ]
        const nonce = await signer.getNonce()

        const feesPerGas = await Router.getFunction("execute(bytes, bytes[], uint256)").estimateGas( ...txArgs, { nonce: nonce} )
        const tx = await Router.getFunction("execute(bytes, bytes[], uint256)")( ...txArgs, {nonce: nonce } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
}

export const swapTokensForExactTokens = async( swapTx: SwapTx ): Promise<void> => {
    /*
    let inputs: string[] = []

    const { trade, deadline, Router, path, slipage } = swapTx
    const { inputAmount, outputAmount, maximumAmountIn, minimumAmountOut } = trade.trade

    let slipageTolerance = (parseFloat( slipage.quotient.toString() ) + 100) * 100
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
/*
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
    */
}

const encode_swap = ( inputAmount: string, outputAmount: string, path: [string, string] ): string => {

    let input: string = ethers.AbiCoder.defaultAbiCoder().encode( 
        [ "address", "uint256", "uint256", "bytes", "bool" ], 
        [ ADDRESS_THIS, inputAmount, outputAmount, "0x", true ] 
    ) 

    // here we remove the last (32 bytes) slot and append the "encoded" path so uniswap V3Path.sol can decode it his way
    input = input.substring( 0, input.length - 64 )
    input = input + encode_path( path )

    return input
}

const encode_path = ( path: [string, string] ): string => {


    let fee: string = '002710' // VERY important
    let concat_path: string = path[0].substring(2) + fee + path[1].substring(2)
    let length: string = "000000000000000000000000000000000000000000000000000000000000002b"

    while ( concat_path.length < 128 )
        concat_path += '0'

    return length + concat_path
}

// const encode_path = ( tokenPath: Token[] ): string => {

//     let length = 0
//     let fee: string = '002710'
//     let feeDai: string = '00bb80'
//     let concat_path: string = ''

//     for ( let i = 0; i < tokenPath.length; i++ )
//     {
//         length += tokenPath[i].address.substring(2).length / 2
//         concat_path += tokenPath[i].address.substring(2)

//         if ( i + 1 < tokenPath.length )
//         {
//             length += fee.length / 2
//             concat_path += i === 0 ? feeDai : fee
//         }
//     }

//     let concat_length = length.toString(16)

//     while ( concat_length.length < 64 )
//         concat_length = '0' + concat_length

//     while ( concat_path.length % 64 )
//         concat_path += '0'

//     return concat_length + concat_path
// }