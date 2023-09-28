import { SwapTx } from "../types";

export const swapExactETHForTokens = async( swapTx: SwapTx ): Promise<void> => {
/*
    let inputs: string[] = []

    const { signer, trade, deadline, Router, path, slipage } = swapTx
    const { inputAmount, outputAmount } = trade

    try {

        console.log(`\n\nSwapping exact ${ inputAmount.toExact() } ${ inputAmount.currency.symbol } for ${ outputAmount.toExact() } ${ outputAmount.currency.symbol }...`)      

        const txArgs = [ commands, inputs, deadline ]

        const feesPerGas = await Router.execute.estimateGas( ...txArgs, { value: inputAmount } )
        const tx = await Router.execute(  ...txArgs, { value: inputAmount.quotient.toString(), maxPriorityFeePerGas: feesPerGas * BigInt( 2 ) } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
    */
}

export const swapETHForExactTokens = async( swapTx: SwapTx ): Promise<void> => {
/*
    let inputs: string[] = []

    const { trade, deadline, Router, path, slipage } = swapTx
    const { inputAmount, outputAmount, maximumAmountIn, minimumAmountOut } = trade.trade

    let slipageTolerance = ( slipage  + 100 ) * 100
    let maxIn = inputAmount.multiply( new Fraction( slipageTolerance, 100 * 100 ) ).quotient.toString()

    try {

        console.log(`\n\nSwapping ${ inputAmount.toExact() } ${ inputAmount.currency.symbol } for exact ${ outputAmount.toExact() } ${ outputAmount.currency.symbol }...`)      

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


export const swapExactTokensForETH = async( swapTx: SwapTx ): Promise<void> => {
/*
    let inputs: string[] = []

    const { signer, trade, deadline, Router, path, slipage } = swapTx
    const { inputAmount, outputAmount } = trade.trade


    try {

        console.log(`\n\nSwapping exact ${ inputAmount.toExact() } ${ inputAmount.currency.symbol } for ${ outputAmount.toExact() } ${ outputAmount.currency.symbol }...`)      

        const txArgs = [ commands, inputs, deadline ]
        const nonce = await signer.getNonce()

        const feesPerGas = await Router.execute.estimateGas( ...txArgs, { value: inputAmount.quotient.toString(), nonce: nonce } )
        const tx = await Router.execute(  ...txArgs, { value: inputAmount.quotient.toString(), nonce: nonce, maxPriorityFeePerGas: feesPerGas * BigInt( 2 ) } )
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("fees: ", ethers.formatEther( receipt?.fee ?? '0' ), 'ETH')

    } catch (error) {
        
        throw( error )

    }
    */
}

export const swapTokensForExactETH = async( swapTx: SwapTx ): Promise<void> => {
/*
    let inputs: string[] = []

    const { trade, deadline, Router, path, slipage } = swapTx
    const { inputAmount, outputAmount } = trade.trade


    try {

        console.log(`\n\nSwapping ${ inputAmount.toExact() } ${ inputAmount.currency.symbol } for exact ${ outputAmount.toExact() } ${ outputAmount.currency.symbol }...`)      

        const txArgs = [ inputs, deadline ]

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