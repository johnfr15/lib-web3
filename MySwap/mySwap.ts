import { ethers } from 'ethers';
import { Account, Contract, uint256, Uint256 } from 'starknet';
import { TESTNET_MYSWAP, TICKER, ERC20_ABI, MYSWAP_ABI } from './constant';
import { get_share_rate, calc_price_impact, resolve_network_contract, resolve_pool, get_reserves, quote, get_amount_out, get_balance, approve, is_balance, fetch_add_liq, fetch_max_add_liq, fetch_withdraw_liq, Uint256_to_float } from './utils';
import dotenv from "dotenv";
import { Add_liquidity_args } from './types';

dotenv.config()





/**
 * @name swap
 * @param signer        // Account to perform the swap
 * @param path          // token swap from path[0] (input) to path[1] (output) 
 * @param amountIn      // The amount that will enter in the pool
 * @param network       // (optional) 'testnet' is the default one
 * @param slipage       // (optional) protection against price movement or to high price impact default is 0.5%
 * @param amountOutMin  // (optional) The minimum output we are ready you cn specify if you prefere using an oracle instead of the pool
 */
export const swap = async(
    signer: Account,
    path: [string, string],
    amountIn: number, 
    network: string = "testnet",
    slipage: number = 995,
    amountOutMin?: Uint256 | undefined | null,
) => {

    try {

        const MySwap = resolve_network_contract(network, signer)
        const pool_id = resolve_pool(path[0], path[1], network)
        const { reserve_in, reserve_out } = await get_reserves(MySwap, path, pool_id)
        
        const Erc20From = new Contract(ERC20_ABI, path[0], signer);
        const Erc20To = new Contract(ERC20_ABI, path[1], signer);
        let decimalsFrom = await Erc20From.functions.decimals()
        let decimalsTo = await Erc20To.functions.decimals()
        decimalsFrom = decimalsFrom.decimals
        decimalsTo = decimalsTo.decimals
        
        let quote_ = await quote( ethers.utils.parseUnits(amountIn.toString(), decimalsFrom), reserve_in, reserve_out )
        let amount_in: Uint256 = uint256.bnToUint256( ethers.utils.parseUnits( amountIn.toString(), decimalsFrom ).toBigInt() )
        let amount_out_min: Uint256 = amountOutMin ?? uint256.bnToUint256( quote_.mul(slipage).div(1000).toBigInt() )
        let amount_out: Uint256 = get_amount_out( ethers.utils.parseUnits(amountIn.toString(), decimalsFrom), reserve_in, reserve_out )
        
        if ( amount_out_min > amount_out )
            throw new Error(`Price impact to high: ${ calc_price_impact( quote_.toBigInt(), uint256.uint256ToBN(amount_out) ) }%`)


        /*========================================= TX ================================================================================================*/
        await approve( MySwap.address, amountIn, path[0], signer )
        /*=============================================================================================================================================*/


        /*========================================= TX ================================================================================================*/
        console.log(`\nSwapping ${amountIn} ${TICKER[path[0]]} for ${ethers.utils.formatUnits( uint256.uint256ToBN(amount_out), decimalsTo )} ${TICKER[path[1]]}...`)
        const tx = await MySwap.functions.swap(pool_id, path[0], amount_in, amount_out_min)
        const receipt: any = await signer.waitForTransaction(tx.transaction_hash);
        console.log(`\nTransaction valided at hash: ${tx.transaction_hash} !`)
        console.log("fees: ", ethers.utils.formatEther( receipt.actual_fee ) , "ETH")
        /*=============================================================================================================================================*/
        
    } catch (error: any) {

        throw new Error(error)

    }
}





/**
 * @name add_liquidity
 * @param signer        // Account to perform the swap
 * @param addressA      // First token
 * @param amountA       // Amount of first token. if set to null will check for amountB or max
 * @param addressB      // Second token
 * @param amountB       // Amount of second token. if set to null will check for amountA or max
 * @param max           // (optional, recommended) if activated it will check for the highest amount possible from tokenA and tokenB
 * @param network       // (optional) 'testnet' is the default one
 * @param slipage       // (optional) protection against price movement or to high price impact default is 0.5%
 */
export const add_liquidity = async(
    signer: Account,                        
    addressA: string,                       
    amountA: number | undefined | null,     
    addressB: string,                       
    amountB: number | undefined | null,     
    max: 0 | 1 = 0,                         
    network: string = "testnet",            
    slipage: number = 995,                  
): Promise<void> => {
    amountA = amountA ?? null
    amountB = amountB ?? null

    let args: Add_liquidity_args

    if ( amountA === null && amountB === null && max === 0 )
        throw new Error("Need to provide at least a value for 'amountA' or 'amountB' or set max");
    if ( await is_balance(signer, addressA, addressB) === 0 )
        throw new Error(`balance is empty for token ${TICKER[addressA]} or ${TICKER[addressB]} or both.`)

    try {

        const MySwap = resolve_network_contract(network, signer)
         
        if ( max )
        {
            args = await fetch_max_add_liq(signer, addressA, addressB, network, slipage)
        }
        else
        {
            let pool_id = resolve_pool(addressA, addressB, network)
            let addr: string = amountA ? addressA : addressB
            let amount: number = amountA ? amountA : amountB!
            args = await fetch_add_liq(signer, pool_id, addr, amount, network, slipage)
        }

        /*========================================= TX ================================================================================================*/
        await approve( 
            MySwap.address, 
            parseFloat( ethers.utils.formatUnits(ethers.BigNumber.from(args.amount_a), args.token_a_decimals) ), 
            args.token_a_addr, 
            signer 
        )
        await approve( 
            MySwap.address, 
            parseFloat( ethers.utils.formatUnits(ethers.BigNumber.from(args.amount_b), args.token_b_decimals) ), 
            args.token_b_addr, 
            signer 
        )
        /*=============================================================================================================================================*/

        /*========================================= TX ================================================================================================*/
        console.log(`\nAdding liquidity for pool ${TICKER[args.token_a_addr]}/${TICKER[args.token_b_addr]}`)
        console.log(`${ethers.utils.formatUnits(ethers.BigNumber.from(args.amount_a), args.token_a_decimals)} ${TICKER[args.token_a_addr]}`)
        console.log(`${ethers.utils.formatUnits(ethers.BigNumber.from(args.amount_b), args.token_b_decimals)} ${TICKER[args.token_b_addr]}`)
        const tx = await MySwap.functions.add_liquidity(
            args.token_a_addr,
            uint256.bnToUint256( args.amount_a ),
            uint256.bnToUint256( args.amount_a_min! ),
            args.token_b_addr,
            uint256.bnToUint256( args.amount_b ), 
            uint256.bnToUint256( args.amount_b_min! )
        )
        const receipt: any = await signer.waitForTransaction(tx.transaction_hash);
        console.log(`\nTransaction valided at hash: ${tx.transaction_hash} !`)
        console.log(`Fees: ${ethers.utils.formatEther( receipt.actual_fee )} ETH`)
        /*=============================================================================================================================================*/

    } catch (error: any) {
        throw new Error(error)
    }
}





/**
 * @name withdraw_liquidity
 * @param signer                // The account to widthdraw its Liquidity Tokens (lp) 
 * @param tokenA                // Address of token A
 * @param tokenB                // Address of token B
 * @param percent               // (optional) Percentage of Liquidity Tokens (lp) to withdraw default is 100%
 * @param network               // (optional) 'testnet' is the default one
 * @param slipage               // (optional) protection against price movement or to high price impact default is 2%
 */
export const withdraw_liquidity = async(
    signer: Account, 
    tokenA: string, 
    tokenB: string, 
    percent: number = 100, 
    network: string = "testnet", 
    slipage: number = 980
) => {
    percent = percent > 100 ? 100 : percent

    if ( percent <= 0 )
        throw new Error("Percent need to be set between 0 to 100")

        try {
            
            const MySwap = resolve_network_contract(network, signer)
            const pool_id = resolve_pool(tokenA, tokenB, network)

            const args = await fetch_withdraw_liq(signer, MySwap, pool_id, percent, slipage)

            /*========================================= TX ================================================================================================*/
            await approve(MySwap.address, Uint256_to_float( args.shares_amount ), args.lp_address, signer )
            /*=============================================================================================================================================*/

            /*========================================= TX ================================================================================================*/
            console.log(`\nWithdrawing ${percent}% of liquidity for:\n\t(minimum) ${Uint256_to_float(args.amount_min_a)} ${TICKER[args.addr_a]}\n\t(minimum) ${Uint256_to_float(args.amount_min_b)} ${TICKER[args.addr_b]}`)
            const tx = await MySwap.functions.withdraw_liquidity(pool_id, args.shares_amount, args.amount_min_a, args.amount_min_b)
            const receipt: any = await signer.waitForTransaction(tx.transaction_hash);
            console.log(`\nTransaction valided at hash: ${tx.transaction_hash} !`)
            console.log(`Fees: ${ethers.utils.formatEther( receipt.actual_fee )} ETH`) 
            /*=============================================================================================================================================*/

        } catch (error: any) {

            throw new Error(error)

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

        const amountA = uint256.bnToUint256(ethers.utils.parseEther(a_init_liq.toString()).toBigInt())
        const amountB = uint256.bnToUint256(ethers.utils.parseEther(b_init_liq.toString()).toBigInt())
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