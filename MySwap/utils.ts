import { ethers } from "ethers";
import { Contract, Uint256, uint256, Account, ProviderInterface, CallData } from "starknet";
import { TESTNET_MYSWAP, TESTNET_PROVIDER, MAINNET_MYSWAP, MAINNET_PROVIDER, TOKENS, TICKER, Pool_mainnet, Pool_testnet, MYSWAP_ABI, ERC20_ABI } from "./constant";
import { AddLiquidityArgs, WidthdrawLiquidityArgs } from "./types";

export const get_amount_out = (amount_in: bigint, reserve_in: bigint, reserve_out: bigint ): Uint256 => {
    let amount_out: bigint

    let amountInWithFee = amount_in * ethers.toBigInt( 1000 ); // No fees
    let numerator = amountInWithFee*reserve_out;
    let denominator = reserve_in * ethers.toBigInt( 1000 ) + amountInWithFee;
    amount_out = numerator / denominator;

    return uint256.bnToUint256( amount_out )
}

export const calc_price_impact = (amount_min: bigint, amount_out: bigint) => {
    let min = amount_min
    let out = amount_out

    let cross_product = out * ethers.toBigInt( 100000 ) / min
    let price_impact = ( parseFloat( cross_product.toString() ) / 1000) - 100

    return price_impact
}

export const sortTokens = (pool: {[key: string]: any}): { tokenA: string, tokenB: string } => {
    const pool_a_addr = "0x0" + pool.token_a_address.toString(16)
    const pool_b_addr = "0x0" + pool.token_b_address.toString(16)

    return { tokenA: pool_a_addr, tokenB: pool_b_addr }
}


export const quote = ( amountA: bigint, reserveA: bigint, reserveB: bigint ): bigint => {
    let amountB: bigint = amountA * reserveB / reserveA
    return amountB;
}

export const get_reserves = async( contract: Contract, path: [string, string], pool_id: number ): Promise<{reserve_in: bigint, reserve_out: bigint}> => {
    const { pool } = await contract.functions.get_pool( pool_id )

    const reserve_in: Uint256  = path[0] === "0x0" + pool.token_a_address.toString(16) ? pool.token_a_reserves : pool.token_b_reserves
    const reserve_out: Uint256 = path[1] === "0x0" + pool.token_a_address.toString(16) ? pool.token_a_reserves : pool.token_b_reserves

    return { 
        reserve_in: uint256.uint256ToBN( reserve_in ), 
        reserve_out: uint256.uint256ToBN( reserve_out ) 
    }
}

export const resolve_network_contract = (network: string, provider?: Account): Contract => {

    if (network === "TESTNET") return new Contract(MYSWAP_ABI, TESTNET_MYSWAP, provider ?? TESTNET_PROVIDER)
    if (network === "MAINNET") return new Contract(MYSWAP_ABI, MAINNET_MYSWAP, provider ?? MAINNET_PROVIDER)

    throw new Error("Unknown network: " + network)
}

export const resolve_pool = (tokenA: string, tokenB: string, network: string): number => {
    const value = BigInt(tokenA) + BigInt(tokenB)

    if (network === "TESTNET")
    {
        if ( value === BigInt(TOKENS[ network ].usdc) + BigInt(TOKENS[ network ].eth) )     return Pool_testnet.USDC_ETH
        if ( value === BigInt(TOKENS[ network ].dai) + BigInt(TOKENS[ network ].eth) )      return Pool_testnet.DAI_ETH
        if ( value === BigInt(TOKENS[ network ].usdc) + BigInt(TOKENS[ network ].dai) )     return Pool_testnet.USDC_DAI
        if ( value === BigInt(TOKENS[ network ].wsteth) + BigInt(TOKENS[ network ].eth) )   return Pool_testnet.wstETH_ETH
    }
    else if (network === "MAINNET")
    {
        if ( value === BigInt(TOKENS[ network ].eth) + BigInt(TOKENS[ network ].usdc) )     return Pool_mainnet.ETH_USDC
        if ( value === BigInt(TOKENS[ network ].dai) + BigInt(TOKENS[ network ].eth) )      return Pool_mainnet.DAI_ETH
        if ( value === BigInt(TOKENS[ network ].wbtc) + BigInt(TOKENS[ network ].usdc) )    return Pool_mainnet.wBTC_USDC
        if ( value === BigInt(TOKENS[ network ].eth) + BigInt(TOKENS[ network ].usdt) )     return Pool_mainnet.ETH_USDT
        if ( value === BigInt(TOKENS[ network ].usdc) + BigInt(TOKENS[ network ].usdt) )    return Pool_mainnet.USDC_USDT
        if ( value === BigInt(TOKENS[ network ].dai) + BigInt(TOKENS[ network ].usdc) )     return Pool_mainnet.DAI_USDC
        if ( value === BigInt(TOKENS[ network ].wsteth) + BigInt(TOKENS[ network ].eth) )   return Pool_mainnet.wstETH_ETH
        if ( value === BigInt(TOKENS[ network ].lords) + BigInt(TOKENS[ network ].eth) )    return Pool_mainnet.LORDS_ETH
    }
    else
        throw new Error(`Network ${network} is not supported.`)

    throw new Error(`Pool:\n\ttokenA: ${tokenA}\n\ttokenB: ${tokenB}\nis not created yet.`)
}

export const get_share_rate = (a_init_liq: number, b_init_liq: number): Uint256 => {

    const mul = a_init_liq * b_init_liq
    const share_rate = Math.sqrt(mul)

    return uint256.bnToUint256(ethers.parseEther( share_rate.toString() ))

}

export const get_balance = async(account_address: string, provider: ProviderInterface, token_address: string): Promise<{ balance: string, decimals: any }> => {
    
    try {

        const erc20 = new Contract(ERC20_ABI, token_address, provider);
        const { balance } = await erc20.balanceOf(account_address);
        const { decimals } = await erc20.decimals();
        let formated = ethers.formatUnits( uint256.uint256ToBN( balance ), decimals );
        
        return { balance: formated, decimals: decimals};

    } catch (error: any) {

        throw new Error(error)

    }

}

export const approve = async(spender: string, amount: string, token_address: string, signer: Account): Promise<void> => {

    try {

        const erc20 = new Contract(ERC20_ABI, token_address, signer);
        const { decimals } = await erc20.decimals()
        const big_amount = uint256.bnToUint256( ethers.parseUnits( amount, decimals ) * ethers.toBigInt( 10 ) /  ethers.toBigInt( 8 ) )
        const callData = {
            contractAddress: erc20.address,
            entrypoint: "approve",
            calldata: [spender, big_amount],
        }

        console.log(`\nApproving ${spender} to spend (${amount} * 1.25) ${TICKER[token_address] ?? "LP"}...`)

        const { suggestedMaxFee } = await signer.estimateInvokeFee(callData);
        const tx = await signer.execute(callData, undefined, { maxFee: suggestedMaxFee })

        const receipt: any = await signer.waitForTransaction(tx.transaction_hash);
        console.log(`\nTransaction valided at hash: ${tx.transaction_hash} !`)
        console.log("fees:            ", ethers.formatEther( receipt.actual_fee ) , "ETH")
        console.log("suggestedMaxFee: ", ethers.formatEther( suggestedMaxFee ), "ETH")
        
    } catch (error: any) {
        
        throw new Error(error)

    }
}

/***********************************|
|            add liquidity          |
|__________________________________*/ 

export const is_balance = async(signer: Account, addressA: string, addressB: string): Promise<number> => {

    try {

        const { balance: balanceA } = await get_balance(signer.address, signer, addressA)
        const { balance: balanceB } = await get_balance(signer.address, signer, addressB)

        if (balanceA === '0.0' || balanceB === '0.0')
            return 0;
        else
            return 1;
        
    } catch (error: any) {
        
        console.log(error)
        return 0

    }
}

export const fetch_max_add_liq = async(
    signer: Account, 
    addrA: string, 
    addrB: string, 
    network: string, 
    slipage: number
): Promise<AddLiquidityArgs> => {
    let args: AddLiquidityArgs;
    
    try {
        
        const MySwap = resolve_network_contract(network, signer)
        const { pool } = await MySwap.functions.get_pool( resolve_pool(addrA, addrB, network) )
        const { tokenA, tokenB } = sortTokens(pool)
        const { balance: balanceA, decimals: decimalsA } = await get_balance(signer.address, signer, tokenA)
        const { balance: balanceB, decimals: decimalsB } = await get_balance(signer.address, signer, tokenB)
        const token_a_reserves = uint256.uint256ToBN( pool.token_a_reserves )
        const token_b_reserves = uint256.uint256ToBN( pool.token_b_reserves )

        // Cross product for both
        let rate_a = ethers.parseUnits(balanceA, decimalsA ) * ethers.toBigInt(100) / token_a_reserves
        let rate_b = ethers.parseUnits(balanceB, decimalsB ) * ethers.toBigInt(100) / token_b_reserves

        if ( rate_a > rate_b)
        {
            // max amount will be tokenB
            args = {
                token_a_addr: tokenA,
                token_a_decimals: decimalsA,
                amount_a: uint256.bnToUint256( await quote(ethers.parseUnits( balanceB, decimalsB ), token_b_reserves, token_a_reserves) ),
                amount_a_min: uint256.bnToUint256( ethers.toBigInt(0) ),
                token_b_addr: tokenB,
                token_b_decimals: decimalsB,
                amount_b: uint256.bnToUint256( ethers.parseUnits( balanceB, decimalsB ) ),
                amount_b_min: uint256.bnToUint256( ethers.toBigInt(0) ),
            }
        }
        else
        {
            // max amount will be tokenA
            args = {
                token_a_addr: tokenA,
                token_a_decimals: decimalsA,
                amount_a: uint256.bnToUint256( ethers.parseUnits( balanceA, decimalsA ) ),
                amount_a_min: uint256.bnToUint256( ethers.toBigInt(0) ),
                token_b_addr: tokenB,
                token_b_decimals: decimalsB,
                amount_b: uint256.bnToUint256( await quote(ethers.parseUnits( balanceA, decimalsA ), token_a_reserves, token_b_reserves) ),
                amount_b_min: uint256.bnToUint256( ethers.toBigInt(0) ),
            }
        }
        // calculate slipage tolerence
        args.amount_a_min = uint256.bnToUint256( uint256.uint256ToBN( args.amount_a ) * ethers.toBigInt(slipage) / ethers.toBigInt(1000) )
        args.amount_b_min = uint256.bnToUint256( uint256.uint256ToBN( args.amount_b ) * ethers.toBigInt(slipage) / ethers.toBigInt(1000) )

        return args

    } catch (error: any) {

        throw error
        
    }
    
} 

export const fetch_add_liq = async(
    signer: Account,
    pool_id: number,
    addr: string, 
    amount: string,
    network: string,
    slipage: number
): Promise<AddLiquidityArgs> => {
    let args: AddLiquidityArgs;
    
    try {
        
        const MySwap = resolve_network_contract(network, signer)
        const { pool } = await MySwap.functions.get_pool( pool_id )
        
        const token_a_reserves     = Uint256_to_bigNumber( pool.token_a_reserves )
        const token_b_reserves     = Uint256_to_bigNumber( pool.token_b_reserves )
        const token_addr1_address  = addr === "0x0" + pool.token_a_address.toString(16) ? "0x0" + pool.token_a_address.toString(16) : "0x0" + pool.token_b_address.toString(16)
        const token_addr2_address  = addr !== "0x0" + pool.token_a_address.toString(16) ? "0x0" + pool.token_a_address.toString(16) : "0x0" + pool.token_b_address.toString(16)
        const token_addr1_reserves = addr === "0x0" + pool.token_a_address.toString(16) ? token_a_reserves : token_b_reserves
        const token_addr2_reserves = addr !== "0x0" + pool.token_a_address.toString(16) ? token_a_reserves : token_b_reserves

        const { balance: balance_addr1, decimals: decimals_addr1 } = await get_balance(signer.address, signer, token_addr1_address)
        const { balance: balance_addr2, decimals: decimals_addr2 } = await get_balance(signer.address, signer, token_addr2_address)
        
        const amount_1 = ethers.parseUnits( amount, decimals_addr1 )
        const amount_2 = await quote(amount_1, token_addr1_reserves, token_addr2_reserves)

        if ( amount_1 > ethers.parseUnits( balance_addr1, decimals_addr1))
            throw new Error(`${TICKER[token_addr1_address]}: Unsufficient balance.`)
        if ( amount_2 > ethers.parseUnits( balance_addr2, decimals_addr2))
            throw new Error(`${TICKER[token_addr2_address]}: Unsufficient balance.\nNeeded ${parseFloat( ethers.formatUnits(amount_2, decimals_addr2))} but got ${parseFloat(balance_addr2)}`)

            // max amount will be tokenB
            args = {
                token_a_addr: token_addr1_address,
                token_a_decimals: decimals_addr1,
                amount_a: uint256.bnToUint256( amount_1 ),
                amount_a_min: uint256.bnToUint256( amount_1 * ethers.toBigInt(slipage) / ethers.toBigInt(1000) ),
                token_b_addr: token_addr2_address,
                token_b_decimals: decimals_addr2,
                amount_b: uint256.bnToUint256( amount_2 ),
                amount_b_min: uint256.bnToUint256( amount_2 * ethers.toBigInt(slipage) / ethers.toBigInt(1000) ),
            }

        return args

    } catch (error: any) {

        throw new Error(error)
        
    }
}

export const fetch_withdraw_liq = async(
    signer: Account, 
    MySwap: Contract, 
    pool_id: number, 
    percent: number, 
    slipage: number
): Promise<WidthdrawLiquidityArgs & {a_decimals: number, b_decimals: number, lp_decimals: number}> => {

    try {
        
        const { pool } = await MySwap.functions.get_pool( pool_id )
        const lp_address = "0x" + pool.liq_token.toString(16)

        const { decimals: a_decimals } = await get_balance(signer.address, signer, "0x" + pool.token_a_address.toString(16))
        const { decimals: b_decimals } = await get_balance(signer.address, signer, "0x" + pool.token_b_address.toString(16))
        const { decimals: lp_decimals } = await get_balance(signer.address, signer, lp_address)
        let { shares: lp_balance } = await MySwap.functions.get_lp_balance( pool_id, signer.address )
        let { total_shares: lp_total } = await MySwap.functions.get_total_shares( pool_id )
        
        let amount_a_token = uint256.uint256ToBN( pool.token_a_reserves ) 
        let amount_b_token = uint256.uint256ToBN( pool.token_b_reserves ) 
        lp_balance = uint256.uint256ToBN( lp_balance )
        lp_total = uint256.uint256ToBN( lp_total )
        
        // Calcul our tokens in pool
        let amount_min_a: bigint = amount_a_token * lp_balance / lp_total
        let amount_min_b: bigint = amount_b_token * lp_balance / lp_total

        // Apply percent parameter
        amount_min_a = amount_min_a * ethers.toBigInt(percent) / ethers.toBigInt(100)
        amount_min_b = amount_min_b * ethers.toBigInt(percent) / ethers.toBigInt(100)

        // Apply slipage tolerance
        amount_min_a = amount_min_a * ethers.toBigInt(slipage) / ethers.toBigInt(1000)
        amount_min_b = amount_min_b * ethers.toBigInt(slipage) / ethers.toBigInt(1000)

        if ( amount_min_a === ethers.toBigInt(0) && amount_min_b !== ethers.toBigInt(0))
            amount_min_a = ethers.toBigInt(1)
        if ( amount_min_a !== ethers.toBigInt(0) && amount_min_b === ethers.toBigInt(0) )
            amount_min_b = ethers.toBigInt(1)

        const args: WidthdrawLiquidityArgs & {a_decimals: number, b_decimals: number, lp_decimals: number} = {
            pool_id: pool_id,
            shares_amount:  uint256.bnToUint256( lp_balance * ethers.toBigInt(percent) / ethers.toBigInt(100) ),
            addr_a: "0x" + pool.token_a_address.toString(16),
            amount_min_a: uint256.bnToUint256( amount_min_a ), 
            a_decimals: a_decimals,
            addr_b: "0x" + pool.token_b_address.toString(16),
            amount_min_b: uint256.bnToUint256( amount_min_b ),
            b_decimals: b_decimals,
            lp_address: lp_address,
            lp_decimals: lp_decimals
        }

        return args
        
    } catch (error: any) {

        throw new Error(error)

    }
}

export const Uint256_to_float = (number: Uint256, decimals: number = 18): number => 
{
    return parseFloat( ethers.formatUnits( uint256.uint256ToBN( number ), decimals ) ) 
}
export const Uint256_to_string = (number: Uint256, decimals: number = 18): string => 
{
    return ethers.formatUnits( uint256.uint256ToBN( number ), decimals )
}
export const string_to_Uint256 = (number: string, decimals: number = 18): Uint256 => 
{
    return uint256.bnToUint256( ethers.parseUnits( number, decimals ) )
}
export const Uint256_to_bigNumber = (number: Uint256 ): bigint => 
{
    return uint256.uint256ToBN( number )
}
export const bn_to_string = (number: bigint, decimals: number = 18): string => 
{
    return ethers.formatUnits( number, decimals )
}
export const float_to_Uint256 = (number: number, decimals: number = 18): Uint256 => 
{
    return uint256.bnToUint256( ethers.parseUnits( number.toString(), decimals ) )
}