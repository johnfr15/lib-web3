import { ethers, BigNumberish } from "ethers";
import { Contract, Uint256, uint256, Account, ProviderInterface } from "starknet";
import { TESTNET_MYSWAP, TESTNET_PROVIDER, MAINNET_MYSWAP, MAINNET_PROVIDER, TOKEN, TICKER, Pool_mainnet, Pool_testnet } from "./constant";
import { MYSWAP_ABI } from "./abis/mySwap";
import { ERC20_ABI } from "./abis/erc20";
import { Add_liquidity_args } from "./types";

export const get_amount_out = (amount_in: ethers.BigNumber, reserve_in: ethers.BigNumber, reserve_out: ethers.BigNumber ): Uint256 => {
    let amount_out: ethers.BigNumber

    let amountInWithFee = amount_in.mul(1000); // No fees
    let numerator = amountInWithFee.mul(reserve_out);
    let denominator = reserve_in.mul(1000).add(amountInWithFee);
    amount_out = numerator.div(denominator);

    return uint256.bnToUint256( amount_out.toBigInt() )
}

export const calc_price_impact = (amount_min: BigNumberish, amount_out: BigNumberish) => {
    let min = ethers.BigNumber.from(amount_min)
    let out = ethers.BigNumber.from(amount_out)

    let cross_product = out.mul(100000).div(min)
    let price_impact = ( parseFloat( cross_product.toString() ) / 1000) - 100

    return price_impact
}

export const sortTokens = (addrA: string, addrB: string, pool: {[key: string]: any}): { tokenA: string, tokenB: string } => {
    const pool_a_addr = "0x" + pool.token_a_address.toString(16)
    const pool_b_addr = "0x" + pool.token_b_address.toString(16)

    const tokenA: string = addrA === pool_a_addr ? pool_a_addr : pool_b_addr
    const tokenB: string = addrB === pool_a_addr ? pool_a_addr : pool_b_addr

    return { tokenA, tokenB }
}


export const quote = async(amountA: ethers.BigNumber, reserveA: ethers.BigNumber, reserveB: ethers.BigNumber): Promise<ethers.BigNumber> => {
    let amountB = amountA.mul(reserveB).div(reserveA)
    return amountB;
}

export const get_reserves = async(contract: Contract, path: [string, string], pool_id: number): Promise<{reserve_in: ethers.BigNumber, reserve_out: ethers.BigNumber}> => {
    const { pool } = await contract.functions.get_pool( pool_id )
    
    const reserve_in: Uint256 = path[0] === "0x" + pool.token_a_address.toString(16) ? pool.token_a_reserves : pool.token_b_reserves
    const reserve_out: Uint256 = path[1] === "0x" + pool.token_a_address.toString(16) ? pool.token_a_reserves : pool.token_b_reserves

    return { 
        reserve_in: ethers.BigNumber.from( uint256.uint256ToBN( reserve_in ) ), 
        reserve_out: ethers.BigNumber.from( uint256.uint256ToBN( reserve_out) ) 
    }
}

export const resolve_network_contract = (network: string, provider?: Account): Contract => {

    if (network === "testnet") return new Contract(MYSWAP_ABI, TESTNET_MYSWAP, provider ?? TESTNET_PROVIDER)
    if (network === "mainnet") return new Contract(MYSWAP_ABI, MAINNET_MYSWAP, provider ?? MAINNET_PROVIDER)

    throw new Error("Unknown network: " + network)
}

export const resolve_pool = (tokenA: string, tokenB: string, network: string): number => {
    const value = BigInt(tokenA) + BigInt(tokenB)

    if (network === "testnet")
    {
        if ( value === BigInt(TOKEN.usdc.testnet) + BigInt(TOKEN.eth.testnet) )     return Pool_testnet.USDC_ETH
        if ( value === BigInt(TOKEN.dai.testnet) + BigInt(TOKEN.eth.testnet) )      return Pool_testnet.DAI_ETH
        if ( value === BigInt(TOKEN.usdc.testnet) + BigInt(TOKEN.dai.testnet) )     return Pool_testnet.USDC_DAI
        if ( value === BigInt(TOKEN.wsteth.testnet) + BigInt(TOKEN.eth.testnet) )   return Pool_testnet.wstETH_ETH
    }
    else if (network === "mainnet")
    {
        if ( value === BigInt(TOKEN.eth.mainnet) + BigInt(TOKEN.usdc.mainnet) )     return Pool_mainnet.ETH_USDC
        if ( value === BigInt(TOKEN.dai.mainnet) + BigInt(TOKEN.eth.mainnet) )      return Pool_mainnet.DAI_ETH
        if ( value === BigInt(TOKEN.wbtc.mainnet) + BigInt(TOKEN.usdc.mainnet) )    return Pool_mainnet.wBTC_USDC
        if ( value === BigInt(TOKEN.eth.mainnet) + BigInt(TOKEN.usdt.mainnet) )     return Pool_mainnet.ETH_USDT
        if ( value === BigInt(TOKEN.usdc.mainnet) + BigInt(TOKEN.usdt.mainnet) )    return Pool_mainnet.USDC_USDT
        if ( value === BigInt(TOKEN.dai.mainnet) + BigInt(TOKEN.usdc.mainnet) )     return Pool_mainnet.DAI_USDC
        if ( value === BigInt(TOKEN.wsteth.mainnet) + BigInt(TOKEN.eth.mainnet) )   return Pool_mainnet.wstETH_ETH
        if ( value === BigInt(TOKEN.lords.mainnet) + BigInt(TOKEN.eth.mainnet) )    return Pool_mainnet.LORDS_ETH
    }
    else
        throw new Error(`Network ${network} is not supported.`)

    throw new Error(`Pool:\n\ttokenA: ${tokenA}\n\ttokenB: ${tokenB}\nis not created yet.`)
}

export const get_share_rate = (a_init_liq: number, b_init_liq: number): Uint256 => {

    const mul = a_init_liq * b_init_liq
    const share_rate = Math.sqrt(mul)

    return uint256.bnToUint256(ethers.utils.parseEther( share_rate.toString() ).toBigInt())

}

export const get_balance = async(account_address: string, provider: ProviderInterface, token_address: string): Promise<{ balance: string, decimals: any }> => {
    
    try {

        const erc20 = new Contract(ERC20_ABI, token_address, provider);
        const { balance } = await erc20.balanceOf(account_address);
        const { decimals } = await erc20.decimals();
        let formated = ethers.utils.formatUnits( uint256.uint256ToBN( balance ), decimals );
        
        return { balance: formated, decimals: decimals};

    } catch (error: any) {

        throw new Error(error)

    }

}

export const approve = async(spender: string, amount: number, token_address: string, signer: Account): Promise<void> => {

    try {

        const erc20 = new Contract(ERC20_ABI, token_address, signer);

        console.log(`\nApproving ${spender} to spend ${amount} ${TICKER[token_address]}...`)
        const { decimals } = await erc20.decimals()
        const big_amount = uint256.bnToUint256( ethers.utils.parseUnits( amount.toString(), decimals).toBigInt() )

        const tx = await erc20.approve(spender, big_amount)
        const receipt: any = await signer.waitForTransaction(tx.transaction_hash);
        console.log(`\nTransaction valided at hash: ${tx.transaction_hash} !`)
        console.log("fees: ", ethers.utils.formatEther( receipt.actual_fee ) , "ETH")
        
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

export const fetch_max_add_liq = async(signer: Account, addrA: string, addrB: string, network: string, slipage: number): Promise<Add_liquidity_args> => {
    let args: Add_liquidity_args;
    
    try {
        
        const MySwap = resolve_network_contract(network, signer)
        const { pool } = await MySwap.functions.get_pool( resolve_pool(addrA, addrB, network) )
        const { tokenA, tokenB } = sortTokens(addrA, addrB, pool)
        const { balance: balanceA, decimals: decimalsA } = await get_balance(signer.address, signer, tokenA)
        const { balance: balanceB, decimals: decimalsB } = await get_balance(signer.address, signer, tokenB)
        const token_a_reserves = ethers.BigNumber.from( uint256.uint256ToBN( pool.token_a_reserves ) )
        const token_b_reserves = ethers.BigNumber.from( uint256.uint256ToBN( pool.token_b_reserves ) )

        // Cross product for both
        let rate_a = parseFloat( balanceA ) * 100 / parseFloat( ethers.utils.formatUnits( token_b_reserves, decimalsB ) )
        let rate_b = parseFloat( balanceB ) * 100 / parseFloat( ethers.utils.formatUnits( token_a_reserves, decimalsA ) )

        if ( rate_a > rate_b)
        {
            // max amount will be tokenB
            args = {
                token_a_addr: tokenA,
                token_a_decimals: decimalsA,
                amount_a: (await quote(ethers.utils.parseUnits( balanceB, decimalsB ), token_a_reserves, token_b_reserves)).toBigInt(),
                amount_a_min: null,
                token_b_addr: tokenB,
                token_b_decimals: decimalsB,
                amount_b: ethers.utils.parseUnits( balanceB, decimalsB ).toBigInt(),
                amount_b_min: null,
            }
        }
        else
        {
            // max amount will be tokenA
            args = {
                token_a_addr: tokenA,
                token_a_decimals: decimalsA,
                amount_a: ethers.utils.parseUnits( balanceA, decimalsA ).toBigInt(),
                amount_a_min: null,
                token_b_addr: tokenB,
                token_b_decimals: decimalsB,
                amount_b: (await quote(ethers.utils.parseUnits( balanceA, decimalsA ), token_b_reserves, token_a_reserves)).toBigInt(),
                amount_b_min: null,
            }
        }
        // calculate slipage tolerence
        args.amount_a_min = ethers.BigNumber.from( args.amount_a ).mul(slipage).div(1000).toBigInt()
        args.amount_b_min = ethers.BigNumber.from( args.amount_b ).mul(slipage).div(1000).toBigInt()

        // console.log("token a: ", TICKER[tokenA])
        // console.log("amount a: ", ethers.utils.formatUnits( ethers.BigNumber.from(args.amount_a), decimalsA ))
        // console.log("amount a min: ", ethers.utils.formatUnits( ethers.BigNumber.from(args.amount_a_min), decimalsA ))
        // console.log("token b: ", TICKER[tokenB])
        // console.log("amount b: ", ethers.utils.formatUnits( ethers.BigNumber.from(args.amount_b), decimalsB ))
        // console.log("amount b min: ", ethers.utils.formatUnits( ethers.BigNumber.from(args.amount_b_min), decimalsB ))

        return args

    } catch (error: any) {

        throw new Error(error)
        
    }
    
} 

export const fetch_add_liq = async(
    signer: Account,
    pool_id: number,
    addr: string, 
    amount: number,
    network: string,
    slipage: number
): Promise<Add_liquidity_args> => {
    let args: Add_liquidity_args;
    
    try {
        
        const MySwap = resolve_network_contract(network, signer)
        const { pool } = await MySwap.functions.get_pool( pool_id )
        
        const token_a_reserves = ethers.BigNumber.from( uint256.uint256ToBN( pool.token_a_reserves ) )
        const token_b_reserves = ethers.BigNumber.from( uint256.uint256ToBN( pool.token_b_reserves ) )
        const token_addr1_address = addr === "0x" + pool.token_a_address.toString(16) ? "0x" + pool.token_a_address.toString(16) : "0x" + pool.token_b_address.toString(16)
        const token_addr2_address = addr !== "0x" + pool.token_a_address.toString(16) ? "0x" + pool.token_a_address.toString(16) : "0x" + pool.token_b_address.toString(16)
        const token_addr1_reserves = addr === "0x" + pool.token_a_address.toString(16) ? token_a_reserves : token_b_reserves
        const token_addr2_reserves = addr !== "0x" + pool.token_a_address.toString(16) ? token_a_reserves : token_b_reserves

        const { balance: balance_addr1, decimals: decimals_addr1 } = await get_balance(signer.address, signer, token_addr1_address)
        const { balance: balance_addr2, decimals: decimals_addr2 } = await get_balance(signer.address, signer, token_addr2_address)
        
        const amount_1 = ethers.utils.parseUnits( amount.toString(), decimals_addr1 )
        const amount_2 = await quote(amount_1, token_addr1_reserves, token_addr2_reserves)

        if ( parseFloat( ethers.utils.formatUnits(amount_1, decimals_addr1)) > parseFloat(balance_addr1) )
            throw new Error(`${TICKER[token_addr1_address]}: Unsufficient balance.`)
        if ( parseFloat( ethers.utils.formatUnits(amount_2, decimals_addr2)) > parseFloat(balance_addr2) )
            throw new Error(`${TICKER[token_addr2_address]}: Unsufficient balance.\nNeeded ${parseFloat( ethers.utils.formatUnits(amount_2, decimals_addr2))} but got ${parseFloat(balance_addr2)}`)

            // max amount will be tokenB
            args = {
                token_a_addr: token_addr1_address,
                token_a_decimals: decimals_addr1,
                amount_a: amount_1.toBigInt(),
                amount_a_min: amount_1.mul(slipage).div(1000).toBigInt(),
                token_b_addr: token_addr2_address,
                token_b_decimals: decimals_addr2,
                amount_b: amount_2.toBigInt(),
                amount_b_min: amount_2.mul(slipage).div(1000).toBigInt(),
            }

        // console.log("token a: ", TICKER[token_addr1_address])
        // console.log("amount a: ", ethers.utils.formatUnits( ethers.BigNumber.from(args.amount_a), decimals_addr1 ))
        // console.log("amount a min: ", ethers.utils.formatUnits( ethers.BigNumber.from(args.amount_a_min), decimals_addr1 ))
        // console.log("token b: ", TICKER[token_addr2_address])
        // console.log("amount b: ", ethers.utils.formatUnits( ethers.BigNumber.from(args.amount_b), decimals_addr2 ))
        // console.log("amount b min: ", ethers.utils.formatUnits( ethers.BigNumber.from(args.amount_b_min), decimals_addr2 ))

        return args

    } catch (error: any) {

        throw new Error(error)
        
    }
}