import { ethers } from 'ethers';
import { Account, Contract, uint256, Uint256 } from 'starknet';
import { TESTNET_MYSWAP, TICKER, MYSWAP_ABI } from './constant';
import { get_share_rate, Uint256_to_string, get_balance } from './utils';
import { get_add_liq_calldata, get_approve_calldata, get_swap_calldata, get_widthdraw_calldata } from './callData';






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
    amountIn: string,
    network: string = "testnet",
    maxFees: bigint | undefined = undefined,
    slipage: number = 995,
    amountOutMin?: Uint256 | undefined | null,
) => {

    try {

        const { decimals: decimals_to } = await get_balance(signer.address, signer, path[1])
        const { decimals: decimals_from } = await get_balance(signer.address, signer, path[0])

        // Get approve Tx
        const approve_calldata = await get_approve_calldata(signer, amountIn, path[0], network)
        const { raw: raw_approve, compiled: approve_tx } = approve_calldata
        
        // Get swap Tx
        const swap_calldata = await get_swap_calldata(signer, path, amountIn, network, slipage, amountOutMin)
        const { raw: raw_swap, compiled: swap_tx } = swap_calldata

        /*========================================= TX ================================================================================================*/
        console.log(`\nMulticall...`)
        console.log(`\t1) Approving ${raw_approve.calldata[0]} to spend ${ Uint256_to_string( raw_approve.calldata[1] as Uint256, decimals_from )} ${TICKER[path[0]]}`)
        console.log(`\t2) Swapping ${ amountIn } ${TICKER[path[0]]} for ${ Uint256_to_string( raw_swap.calldata[3] as Uint256, decimals_to )} ${TICKER[path[1]]}`)

        const { suggestedMaxFee } = await signer.estimateInvokeFee([ approve_tx, swap_tx ]);
        const multiCall           = await signer.execute([ approve_tx, swap_tx ], undefined, { maxFee: maxFees ?? suggestedMaxFee })
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
    max: 0 | 1 = 0,                         
    network: string = "testnet",            
    slipage: number = 995,
    maxFees: bigint | undefined = undefined,
): Promise<void> => {
    amountA = amountA ?? null
    amountB = amountB ?? null

    try {

        // Get add liquidity Tx
        const add_liq_calldata = await get_add_liq_calldata(signer, addressA, amountA, addressB, amountB, max, network, slipage)
        const { raw: raw_add, compiled: addTx } = add_liq_calldata
        const [ token_a_addr, amount_a, amount_a_min, token_b_addr, amount_b ] = raw_add.calldata

        // Get approve token 'a' Tx
        const approve_a_calldata = await get_approve_calldata(signer, Uint256_to_string( amount_a as Uint256, raw_add.utils!.decimalsA as number), token_a_addr as string, network)
        const { raw: raw_approve_a, compiled: approveATx } = approve_a_calldata

        // Get approve token 'b' Tx
        const approve_b_calldata = await get_approve_calldata(signer, Uint256_to_string( amount_b as Uint256, raw_add.utils!.decimalsB as number), token_b_addr as string, network)
        const { raw: raw_approve_b, compiled: approveBTx } = approve_b_calldata


        /*========================================= TX ================================================================================================*/
        console.log(`\nMulticall...`)
        console.log(`\t1) Approving ${raw_approve_a.calldata[0]} to spend ${ Uint256_to_string( raw_approve_a.calldata[1] as Uint256, raw_add.utils!.decimalsA as number )} ${TICKER[token_a_addr as string]}`)
        console.log(`\t2) Approving ${raw_approve_b.calldata[0]} to spend ${ Uint256_to_string( raw_approve_b.calldata[1] as Uint256, raw_add.utils!.decimalsB as number )} ${TICKER[token_b_addr as string]}`)
        console.log(`\t3) Adding liquidity for pool ${TICKER[token_a_addr as string]}/${TICKER[token_b_addr as string]}`)

        const { suggestedMaxFee } = await signer.estimateInvokeFee([ approveATx, approveBTx, addTx ]);
        const multiCall           = await signer.execute([ approveATx, approveBTx, addTx ], undefined, { maxFee: maxFees ?? suggestedMaxFee })
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
    network: string = "testnet", 
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
            console.log(`\t1) Approving ${raw_widthdraw.contractAddress} to spend ${ Uint256_to_string( shares_amount as Uint256, decimalsLp )} ${TICKER[addrLp as string] ?? "LP"}`)
            console.log(`\t2) Withdrawing ${percent}% of liquidity for:\n\t\t(minimum) ${Uint256_to_string( amount_a_min as Uint256, decimalsA)} ${TICKER[addrA as string]}\n\t\t(minimum) ${Uint256_to_string(amount_b_min as Uint256, decimalsB)} ${TICKER[addrB as string]}`)

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