import { ethers } from 'ethers';
import { Account, Uint256 } from 'starknet';
import { ROUTER_ADDRESSES, TICKER } from './constant';
import { Uint256_to_string, get_balance, is_balance } from './utils';
import { get_swap_calldata } from './calldata/swapCalldata';
import { get_approve_calldata } from './calldata/approveCalldata';
import { get_add_liq_calldata } from './calldata/addLiqCalldata';
import { get_remove_calldata } from './calldata/withdrawLiqCalldata';





/**
 * @name swap
 * @param signer        // Account to perform the swap
 * @param path          // token swap from path[0] (input) to path[1] (output) 
 * @param amountIn      // The amount that will enter in the pool
 * @param network       // (optional) 'testnet' is the default one
 * @param maxFees       // (optional) max fees signer is ready to pay for executing transaction
 * @param slipage       // (optional) protection against price movement or to high price impact default is 0.5%
 * @param amountOutMin  // (optional) The minimum output we are ready you cn specify if you prefere using an oracle instead of the pool
 */
export const swap = async(
    signer: Account,
    path: [string, string],
    amountIn: string | null,
    amountOut: string | null = null,
    network: 'TESTNET' | 'MAINNET' = 'TESTNET',
    maxFees?: bigint,
    slipage: number = 0.5, // this represent 0.5% of slipage
    priceImpact: number = 2, // this represent 2% of allowed price impact (default)
    deadline?: number,
) => {

    try {

        if ( slipage < 0.01 || slipage > 100 )
            throw new Error(`Slipage parameter must be a number between 0.01 and 100`)
        if ( amountIn === null && amountOut === null )
            throw new Error(`You need to specify an amount for 'amountIn' or 'amountOut'`)

    
        const { decimals: decimals_from } = await get_balance( signer.address, path[0], signer )
        const { decimals: decimals_to } = await get_balance( signer.address, path[1], signer )

        // Get swap Tx
        const swap_calldata = await get_swap_calldata( signer, path, amountIn, amountOut, network, slipage, priceImpact, deadline )
        const [ amount_in, amount_out ] = swap_calldata.calldata
        const { tradeType, priceImpact: price_impact } = swap_calldata.utils


        // Get approve Tx
        const approve_calldata = await get_approve_calldata( signer, Uint256_to_string( amount_in as Uint256, decimals_from ), path[0], network )
        const [ spender, amount ] = approve_calldata.calldata


        /*========================================= TX ================================================================================================*/
        console.log(`\nMulticall...`)
        console.log(`\t1) Approving ${ spender } to spend ${ Uint256_to_string( amount as Uint256, decimals_from ) } ${ TICKER[ path[0] ] }`)
        console.log(`\t2) Swapping ${ tradeType === 1 ? '(maximum)' : ''}${ amountIn } ${ TICKER[ path[0] ] } for ${ tradeType === 0 ? '(minimum)' : ''}${Uint256_to_string( amount_out as Uint256, decimals_to ) } ${ TICKER[ path[1] ] }`)      
        console.log(`\nPrice impact: ${ price_impact }%`)

        const { suggestedMaxFee } = await signer.estimateInvokeFee( [ approve_calldata, swap_calldata ] );
        const multiCall           = await signer.execute( [ approve_calldata, swap_calldata ], undefined, { maxFee: maxFees ?? suggestedMaxFee } )
        const receipt: any        = await signer.waitForTransaction( multiCall.transaction_hash );
        
        console.log(`\nTransaction valided !`)
        console.log("hash:            ", multiCall.transaction_hash)
        console.log("fees:            ", ethers.formatEther( receipt.actual_fee ) , "ETH")
        console.log("suggestedMaxFee: ", ethers.formatEther( maxFees ?? suggestedMaxFee ), "ETH")
        /*=============================================================================================================================================*/
        
    } catch (error: any) {

        throw error

    }
}


 


/**
 * @name addLiquidity
 * @param signer        // Account to perform the swap
 * @param addressA      // First token
 * @param amountA       // Amount of first token. if set to null will check for amountB or max
 * @param addressB      // Second token
 * @param amountB       // Amount of second token. if set to null will check for amountA or max
 * @param max           // (optional, recommended) if activated it will check for the highest amount possible from tokenA and tokenB
 * @param network       // (optional) 'testnet' is the default one
 * @param slipage       // (optional) protection against price movement or to high price impact default is 0.5%
 * @param maxFees       // (optional) max fees signer is ready to pay for executing transaction
 */
export const addLiquidity = async(
    signer: Account,                        
    addressA: string,                       
    amountA: string | null,     
    addressB: string,                       
    amountB: string | null,     
    max: boolean = false,                         
    network: 'TESTNET' | 'MAINNET' = 'TESTNET',
    slipage: number = 2, // this represent 2% of slipage
    deadline: number | null = null,
    maxFees?: bigint,
): Promise<void> => {

    deadline = deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20  // 20 minutes from the current Unix time

    try {

        if ( slipage < 2 || slipage > 100 )
            throw new Error("Slipage need to be a number between 2 and 100");
        if ( amountA === null && amountB === null && max === false )
            throw new Error("Need to provide at least a value for 'amountA' or 'amountB' or set max");
        if ( await is_balance( signer, addressA, addressB ) === 0 )
            throw new Error(`balance is empty for token ${ TICKER[ addressA ] } or ${ TICKER[ addressB ] } or both.`)

        
        // Get add liquidity Tx
        const add_liq_calldata = await get_add_liq_calldata( signer, addressA, amountA, addressB, amountB, max, network, slipage, deadline )
        const { addLiquidityTx, utils } = add_liq_calldata
        const [ tokenA, tokenB, amountADesired, amountBDesired ] = addLiquidityTx.calldata

        // Get approve token 'a' Tx
        const approveATx = await get_approve_calldata(signer, Uint256_to_string( amountADesired as Uint256, utils.tokenA.decimals ), tokenA as string, network)

        // Get approve token 'b' Tx
        const approveBTx = await get_approve_calldata(signer, Uint256_to_string( amountBDesired as Uint256, utils.tokenB.decimals ), tokenB as string, network)
        
        /*========================================= TX ================================================================================================*/

        console.log(`\nMulticall...`)
        console.log(`\t1) Approving ${ addLiquidityTx.contractAddress } to spend ${ Uint256_to_string( amountADesired as Uint256, utils.tokenA.decimals ) } ${ TICKER[ tokenA as string ] }` )
        console.log(`\t2) Approving ${ addLiquidityTx.contractAddress } to spend ${ Uint256_to_string( amountBDesired as Uint256, utils.tokenB.decimals ) } ${ TICKER[ tokenB as string ] }` )
        console.log(`\t3) Adding liquidity for pool ${ TICKER[ tokenA as string ] }/${ TICKER[ tokenB as string ] }` )

        const { suggestedMaxFee } = await signer.estimateInvokeFee([ approveATx, approveBTx, addLiquidityTx ]);
        const multiCall           = await signer.execute([ approveATx, approveBTx, addLiquidityTx ], undefined, { maxFee: maxFees ?? suggestedMaxFee })
        const receipt: any        = await signer.waitForTransaction(multiCall.transaction_hash);
        
        console.log(`\nTransaction valided !`)
        console.log("hash:            ", multiCall.transaction_hash)
        console.log("fees:            ", ethers.formatEther( receipt.actual_fee ) , "ETH")
        console.log("suggestedMaxFee: ", ethers.formatEther( maxFees ?? suggestedMaxFee ), "ETH")

        /*=============================================================================================================================================*/
        
    } catch (error: any) {

        throw error

    }
}





/**
 * @name withdrawLiquidity
 * @param signer                // The account to widthdraw its Liquidity Tokens (lp) 
 * @param tokenA                // Address of token A
 * @param tokenB                // Address of token B
 * @param percent               // (optional) Percentage of Liquidity Tokens (lp) to withdraw default is 100%
 * @param network               // (optional) 'testnet' is the default one
 * @param slipage               // (optional) protection against price movement or to high price impact default is 2%
 * @param maxFees               // (optional) max fees signer is ready to pay for executing transaction
 */
export const withdrawLiquidity = async(
    signer: Account, 
    tokenA: string, 
    tokenB: string, 
    percent: number = 100, 
    network: 'TESTNET' | 'MAINNET' = 'TESTNET', 
    slipage: number = 0.5, // this represent 0.5% of allowed slipage (default)
    deadline: number | null = null,
    maxFees?: bigint,
) => {

    deadline = deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20  // 20 minutes from the current Unix time

    try {

        if ( slipage < 0 || slipage > 100 )
            throw new Error("Slipage need to be a number between 0 and 100");
        if ( percent <= 0 || percent > 100 )
            throw new Error("Percent need to be set between 0 to 100")


            // Get widthdraw liquidity Tx
            const withdraw_calldata = await get_remove_calldata( signer, tokenA, tokenB, percent, slipage, network, deadline )
            const { removeLiquidityTx, utils } = withdraw_calldata
            const [ token_a, token_b, liquidity, amountAMin, amountBMin ] = removeLiquidityTx.calldata
            const lp_decimals = utils.pool.liquidityToken.decimals
            const lp_address = utils.pool.liquidityToken.address

            // Get approve Tx
            const approveTx = await get_approve_calldata(signer, Uint256_to_string( liquidity as Uint256, lp_decimals ), lp_address, network)

            /*========================================= TX ================================================================================================*/

            console.log(`\nMulticall...`)
            console.log(`\t1) Approving ${ ROUTER_ADDRESSES[ network ] } to spend ${ Uint256_to_string( liquidity as Uint256, lp_decimals ) } ${TICKER[ lp_address ] ?? "LP"}`)
            console.log(`\t2) Withdrawing ${ percent }% of liquidity for:\n\t\
                        (minimum)${ Uint256_to_string( amountAMin as Uint256, utils.token0.decimals ) } ${ TICKER[ utils.token0.address ] }\n\t\
                        (minimum)${ Uint256_to_string( amountBMin as Uint256, utils.token1.decimals ) } ${ TICKER[ utils.token1.address ] }
            `)

            const { suggestedMaxFee } = await signer.estimateInvokeFee([ approveTx, removeLiquidityTx ]);
            const multiCall           = await signer.execute([ approveTx, removeLiquidityTx ], undefined, { maxFee: maxFees ?? suggestedMaxFee })
            const receipt: any        = await signer.waitForTransaction(multiCall.transaction_hash);
            
            console.log(`\nTransaction valided !`)
            console.log("hash:            ", multiCall.transaction_hash)
            console.log("fees:            ", ethers.formatEther( receipt.actual_fee ) , "ETH")
            console.log("suggestedMaxFee: ", ethers.formatEther( maxFees ?? suggestedMaxFee ), "ETH")

            /*=============================================================================================================================================*/

        } catch (error: any) {

            throw error

        }
}
