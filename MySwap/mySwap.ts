import { ethers } from 'ethers';
import { Account, Contract, uint256, BigNumberish, Uint256 } from 'starknet';
import { ERC20_ABI } from './abis/erc20';
import { MYSWAP_ABI } from './abis/mySwap';
import { TESTNET_MYSWAP, TESTNET_PROVIDER, TOKEN, TICKER } from './constant';
import { get_share_rate, calc_price_impact, resolve_network_contract, resolve_pool, get_reserves, quote, get_amount_out, get_balance, approve, is_balance, fetch_add_liq, fetch_max_add_liq } from './utils';
import dotenv from "dotenv";
import { Add_liquidity_args } from './types';

dotenv.config()


/**
 * @name swap
 */
export const swap = async(
    signer: Account,
    path: [string, string],
    amountIn: number, 
    network?: string | undefined | null,
    slipage?: number | undefined | null,
    amountOutMin?: Uint256 | undefined | null,
) => {
    network = network ?? "testnet"
    slipage = slipage ?? 995 // 0.5% of difference accepted

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
 */
export const add_liquidity = async(
    signer: Account, 
    addressA: string, 
    amountA: number | undefined | null, 
    addressB: string, 
    amountB: number | undefined | null,
    max?: 0 | 1 | undefined | null,
    network?: string | undefined | null,
    slipage?: number | undefined | null,
): Promise<void> => {
    amountA = amountA ?? null
    amountB = amountB ?? null
    max = max ?? 0
    network = network ?? "testnet"
    slipage = slipage ?? 995 // 0.5% of difference accepted
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
        console.log(`Transaction valided at hash: ${tx.transaction_hash} !`)
        console.log(`Fees: ${ethers.utils.formatEther( receipt.actual_fee )} ETH`)
        /*=============================================================================================================================================*/

    } catch (error: any) {
        throw new Error(error)
    }
}

/**
 * @name withdraw_liquidity
 */
export const withdraw_liquidity = async() => {

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


const main = async() => {
    const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS
    const PRIVATE_KEY = process.env.PRIVATE_KEY
    const network = "testnet" // testnet | mainnet

    try {
        // connect the contract
        const signer = new Account(TESTNET_PROVIDER, ACCOUNT_ADDRESS!, PRIVATE_KEY!);
        const contract = new Contract(MYSWAP_ABI, TESTNET_MYSWAP, signer);
        const { balance } = await get_balance(signer.address, signer, TOKEN.eth[network])
        console.log("Account: ", signer.address)
        console.log("Balance: ", balance, TICKER[TOKEN.eth[network]])

        // await swap( signer, [TOKEN.eth[network], TOKEN.usdc[network]], 0.000001 ) 
        /* 
        await add_liquidity(
            signer, 
            TOKEN.eth[network],
            0.00001, 
            TOKEN.dai[network],
            null,
        )
        */


    } catch (error: any) {

        console.log(error)
        return (1)

    }
}

main()