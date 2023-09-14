import { ethers } from 'ethers';
import { Account, Contract, uint256, Uint256 } from 'starknet';
import { TESTNET_MYSWAP, TICKER, MYSWAP_ABI, TOKENS } from './constant';
import { get_share_rate, Uint256_to_string, get_balance, enforce_fees, quote } from './utils';
import { get_add_liq_calldata, get_approve_calldata, get_swap_calldata, get_widthdraw_calldata } from './callData';






/**
 * @name swap
 * @param signer        // Account to perform the swap
 * @param path          // token swap from path[0] (input) to path[1] (output) 
 * @param amountIn      // The amount that will enter in the pool
 * @param network       // (optional) 'testnet' is the default one
 * @param maxFees       // (optional) max fees signer is ready to pay for executing transaction
 * @param slipage       // (optional) protection against price movement or to high price impact default is 2%
 * @param amountOutMin  // (optional) The minimum output we are ready you cn specify if you prefere using an oracle instead of the pool
 */
export const swap = async(
    signer: Account,
    path: [string, string],
    amountIn: string,
    network: 'TESTNET' | 'MAINNET' = "TESTNET",            
    maxFees: bigint | undefined = undefined,
    slipage: number = 2,   
    amountOutMin?: Uint256 | undefined | null,
) => {

    path[0] = path[0].toLowerCase()
    path[1] = path[1].toLowerCase()

    try {
        
        const { decimals: decimals_to }   = await get_balance( signer.address, path[1], signer )
        const { decimals: decimals_from } = await get_balance( signer.address, path[0], signer )

        // Get approve Tx
        const approve_calldata = await get_approve_calldata( signer, amountIn, path[0], network )
        let { raw: raw_approve, compiled: approve_tx } = approve_calldata
        
        // Get swap Tx
        const swap_calldata = await get_swap_calldata( signer, path, amountIn, network, slipage, amountOutMin )
        let { raw: raw_swap, compiled: swap_tx } = swap_calldata

        const { suggestedMaxFee } = await signer.estimateInvokeFee([ approve_tx, raw_swap ]);
        
        // Get fees and enforce fees for a ETH swap
        if ( path[0] === TOKENS[ network ].eth )
            raw_swap.calldata[2] = await enforce_fees( raw_swap.calldata[2] as Uint256, suggestedMaxFee, signer, network )


        /*========================================= TX ================================================================================================*/
        console.log(`\nMulticall...`)
        console.log(`\t1) Approving ${ raw_approve.calldata[0] } to spend ${ Uint256_to_string( raw_approve.calldata[1] as Uint256, decimals_from )} ${ TICKER[ path[0] ] }`)
        console.log(`\t2) Swapping ${ Uint256_to_string( raw_swap.calldata[2] as Uint256 ) } ${ TICKER[ path[0] ] } for ${ Uint256_to_string( raw_swap.calldata[3] as Uint256, decimals_to )} ${ TICKER[ path[1] ] }`)

        const multiCall           = await signer.execute([ approve_tx, raw_swap ], undefined, { maxFee: maxFees ?? suggestedMaxFee })
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
    amountA: string | undefined | null,     
    addressB: string,                       
    amountB: string | undefined | null,     
    max: boolean = false,                         
    network: 'TESTNET' | 'MAINNET' = "TESTNET",            
    slipage: number = 2,
    maxFees: bigint | undefined = undefined,
): Promise<void> => {

    addressA = addressA.toLowerCase()
    addressB = addressB.toLowerCase()
    amountA = amountA ?? null
    amountB = amountB ?? null

    try {

        // Get add liquidity Tx
        const { addTx, utils } = await get_add_liq_calldata(signer, addressA, amountA, addressB, amountB, max, network, slipage)
        const [ token_a_addr, amount_a, amount_a_min, token_b_addr, amount_b ] = addTx.calldata
        const { reserveA, reserveB } = utils

        // Get approve token 'a' Tx
        const approve_a_calldata = await get_approve_calldata(signer, Uint256_to_string( amount_a as Uint256, utils!.decimalsA as number), token_a_addr as string, network)
        const { raw: raw_approve_a, compiled: approveATx } = approve_a_calldata

        // Get approve token 'b' Tx
        const approve_b_calldata = await get_approve_calldata(signer, Uint256_to_string( amount_b as Uint256, utils!.decimalsB as number), token_b_addr as string, network)
        const { raw: raw_approve_b, compiled: approveBTx } = approve_b_calldata

        const { suggestedMaxFee } = await signer.estimateInvokeFee([ approveATx, approveBTx, addTx ]);


        // Get fees and enforce fees for a ETH swap
        if ( addTx.calldata[0] === TOKENS[ network ].eth )
        {
            addTx.calldata[1] = await enforce_fees( addTx.calldata[1] as Uint256, suggestedMaxFee, signer, network )
            addTx.calldata[2] = uint256.bnToUint256( uint256.uint256ToBN( addTx.calldata[1] ) * BigInt(100 * 100 - (100 * slipage)) / BigInt( 100 * 100 ) )
            addTx.calldata[4] = uint256.bnToUint256( await quote( uint256.uint256ToBN( addTx.calldata[1] ), reserveA, reserveB ) )
            addTx.calldata[5] = uint256.bnToUint256( uint256.uint256ToBN( addTx.calldata[4] ) * BigInt(100 * 100 - (100 * slipage)) / BigInt( 100 * 100 ) )
        }
        if ( addTx.calldata[3] === TOKENS[ network ].eth )
        {
            addTx.calldata[4] = await enforce_fees( addTx.calldata[4] as Uint256, suggestedMaxFee, signer, network )
            addTx.calldata[5] = uint256.bnToUint256( uint256.uint256ToBN( addTx.calldata[4] ) * BigInt(100 * 100 - (100 * slipage)) / BigInt( 100 * 100 ) )
            addTx.calldata[1] = uint256.bnToUint256( await quote( uint256.uint256ToBN( addTx.calldata[4] ), reserveB, reserveA ) )
            addTx.calldata[2] = uint256.bnToUint256( uint256.uint256ToBN( addTx.calldata[1] ) * BigInt(100 * 100 - (100 * slipage)) / BigInt( 100 * 100 ) )
        }
        

        /*========================================= TX ================================================================================================*/
        console.log(`\nMulticall...`)
        console.log(`\t1) Approving ${ raw_approve_a.calldata[0] } to spend ${ Uint256_to_string( raw_approve_a.calldata[1] as Uint256, utils!.decimalsA as number )} ${ TICKER[ token_a_addr as string ] }`)
        console.log(`\t2) Approving ${ raw_approve_b.calldata[0] } to spend ${ Uint256_to_string( raw_approve_b.calldata[1] as Uint256, utils!.decimalsB as number )} ${ TICKER[ token_b_addr as string ] }`)
        console.log(`\t3) Adding liquidity for pool ${ TICKER[ token_a_addr as string ] }/${ TICKER[ token_b_addr as string ] }`)

        const multiCall    = await signer.execute([ approveATx, approveBTx, addTx ], undefined, { maxFee: maxFees ?? suggestedMaxFee })
        const receipt: any = await signer.waitForTransaction(multiCall.transaction_hash);
        
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
    network: 'TESTNET' | 'MAINNET' = "TESTNET", 
    slipage: number = 980,
    maxFees: bigint | undefined = undefined,
) => {
    percent = percent > 100 ? 100 : percent

    if ( percent <= 0 )
        throw new Error("Percent need to be set between 0 to 100")

        try {

            // Get widthdraw liquidity Tx
            const withdraw_calldata = await get_widthdraw_calldata(signer, tokenA, tokenB, percent, slipage, network)
            const { raw: raw_widthdraw, compiled: withdrawTx } = withdraw_calldata
            const [ pool_id, shares_amount, amount_a_min, amount_b_min ] = raw_widthdraw.calldata
            const { decimalsA, decimalsB, decimalsLp, addrA, addrB, addrLp } = raw_widthdraw.utils!
            // Get approve Tx
            const approve_calldata = await get_approve_calldata(signer, Uint256_to_string( shares_amount as Uint256, decimalsLp ), addrLp as string, network)
            const { compiled: approveTx } = approve_calldata

            /*========================================= TX ================================================================================================*/
            console.log(`\nMulticall...`)
            console.log(`\t1) Approving ${ raw_widthdraw.contractAddress } to spend ${ Uint256_to_string( shares_amount as Uint256, decimalsLp )} ${ TICKER[ addrLp as string ] ?? "LP"}`)
            console.log(`\t2) Withdrawing ${ percent }% of liquidity for:\n\t\t(minimum) ${ Uint256_to_string( amount_a_min as Uint256, decimalsA)} ${ TICKER[ addrA as string ]}\n\t\t(minimum) ${ Uint256_to_string( amount_b_min as Uint256, decimalsB ) } ${ TICKER[ addrB as string ] }`)

            const { suggestedMaxFee } = await signer.estimateInvokeFee([ approveTx, withdrawTx ]);
            const multiCall           = await signer.execute([ approveTx, withdrawTx ], undefined, { maxFee: maxFees ?? suggestedMaxFee })
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
 * @name create_new_pool
 * @param account 
 * @param pool_name 
 * @param a_addr 
 * @param a_init_liq 
 * @param b_addr 
 * @param b_init_liq 
 * @returns 
 */
export const create_new_pool = async(
    account: Account,
    pool_name: string, 
    a_addr: string, 
    a_init_liq: number, 
    b_addr: string, 
    b_init_liq: number
) => {
    const contract = new Contract(MYSWAP_ABI, TESTNET_MYSWAP, account);

    try {

        const amountA = uint256.bnToUint256(ethers.parseEther(a_init_liq.toString()))
        const amountB = uint256.bnToUint256(ethers.parseEther(b_init_liq.toString()))
        const share_rate = get_share_rate(a_init_liq, b_init_liq)
        
        console.log(`Creating new ${pool_name} pool...`)
        const tx = await contract.functions.create_new_pool(pool_name, a_addr, amountA, b_addr, amountB, share_rate)
        const receipt = await tx.wait()
        console.log(`New pool created successfully !`)

        return receipt

    } catch (error: any) {

        throw new Error(error)

    }
}