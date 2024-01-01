import fs from "fs"
import * as addUtils from "./add"
import * as swapUtils from "./swap"
import chains from "../../config/chains"
import { Token, Pool } from "../../types"
import { ethers, Wallet, Contract, JsonRpcProvider, ZeroAddress} from "ethers"
import { ERC20_ABI, TOKENS, CONTRACTS, POOL_ABI, CHAIN_ID, ROUTER_ABI, POOL_STABLE, FACTORY_ABI } from "../../config/constants"



export const resolve_chain = ( signer: Wallet ): Wallet => {

    const provider = resolve_provider( CHAIN_ID[ "base" ] )
    signer = new Wallet( signer.privateKey, provider )

    return signer
}

export const get_token = async( tokenAddress: string ): Promise<Token> => {

    const FILE_PATH = __dirname + "/../../config/base.json"
    let Tokens: {[key: string]: Token } = {}

    if ( is_native( tokenAddress ) )
        tokenAddress = TOKENS.weth9

    try {
        
        Tokens = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        
    } catch (error) {

        throw(`Error: ${ FILE_PATH } do not contains the tokens datas`)    

    }

    const token = Object.values(Tokens).find( (token: Token) => 
    {
        if ( BigInt( token.address ) !== BigInt( tokenAddress ) ) return false
        if ( token.chainId !== CHAIN_ID[ "base" ] )               return false

        return true
    })


    if ( token === undefined )
        throw(`Error: Can't find token ${ tokenAddress } on network base, please add it to /Mute/config/tokens.ts`)
    

    return token
}


/**
 * @notice Will set the signer with the right provider for the transaction 
 */
export const resolve_provider = ( chainId: number ): JsonRpcProvider => {

    const chain_info = Object.values( chains ).find(( item ) => parseInt( item.chainId ) === chainId )

    const provider = new JsonRpcProvider( chain_info!.rpc[0] )

    return provider
}

/**
 * @notice Will fetch the pool related to tokenA and tokenB and fee
 */
export const get_pool = async( tokenA: Token, tokenB: Token, signer: Wallet, options: any ): Promise<Pool> => {

    try {

        const Factory = new Contract( CONTRACTS.FACTORY, FACTORY_ABI, signer )

        const { token0, token1 } = sort_tokens( tokenA, tokenB, '0', '0' )

        // This wil fetch and return the address of the pool
        // By specifying zeroAddress it will use default factory 
        const poolAddress: string = await Factory.getPair( token0.address, token1.address )
        const Pool = new Contract( poolAddress, POOL_ABI, signer )
        const [ reserveX, reserveY ] = await Pool.getReserves() 

        const pool: Pool = {
            tokenX: token0,
            tokenY: token1,
            reserveX: reserveX,
            reserveY: reserveY,
            poolAddress: poolAddress,
            Pool: Pool
        }
    
        return pool

    } catch (error) {
        
        throw( error )

    }
}


export const get_balance = async(
    tokenAddress: string, 
    signer: Wallet,
): Promise<{ bigint: bigint, string: string, decimals: number }> => {
    
    let balance: bigint;
    let decimals: number

    const erc20 = new Contract(tokenAddress, ERC20_ABI, signer);
    const network = await signer.provider?.getNetwork()

    if ( is_native( tokenAddress ) )
    {
        balance  = await signer.provider!.getBalance( signer.address )
        decimals = 18
    }
    else
    {
        balance = await erc20.balanceOf( signer.address );
        decimals = await erc20.decimals();
    }

    let formated = ethers.formatUnits( balance , decimals );
    
    return { 
        bigint: balance,
        string: formated, 
        decimals: decimals
    };
}

/**
 * @notice Fetch the quote for tokenA with amountA in term of tokenB 
 * @returns amountB 
 */
export const get_quote = ( amountA: bigint, tokenA: Token, tokenB: Token, pool: Pool): bigint => {

    const reserveA: bigint = BigInt( tokenA.address ) === BigInt( pool.tokenX.address ) ? pool.reserveX : pool.reserveY
    const reserveB: bigint = BigInt( tokenA.address ) === BigInt( pool.tokenX.address ) ? pool.reserveY : pool.reserveX 

    const amount_a: number = parseFloat( ethers.formatUnits( amountA, tokenA.decimals ) )
    const reserve_a: number = parseFloat( ethers.formatUnits( reserveA, tokenA.decimals ) )
    const reserve_b: number = parseFloat( ethers.formatUnits( reserveB, tokenB.decimals ) )

    const amountB = (amount_a * reserve_b / reserve_a).toFixed( tokenB.decimals )

    return ethers.parseUnits( amountB, tokenB.decimals )
}

export const is_balance = async(signer: Wallet, addressA: string, addressB: string): Promise<number> => {

    try {

        const balanceA = await get_balance( addressA, signer )
        const balanceB = await get_balance( addressB, signer )

        if ( balanceA.string === '0.0' || balanceB.string === '0.0' )
            return 0;
        
        return 1;
        
    } catch (error: any) {
        
        throw error

    }
}


export const sort_tokens = ( tokenA: Token, tokenB: Token, amountA: string | null, amountB: string | null ): { token0: Token, token1: Token, amount0: bigint, amount1: bigint } => {

    const token0 = BigInt( tokenA.address ) < BigInt( tokenB.address ) ? tokenA : tokenB
    const token1 = BigInt( tokenA.address ) > BigInt( tokenB.address ) ? tokenA : tokenB 
    const amount0 = BigInt( token0.address ) === BigInt( tokenA.address ) ? ethers.parseUnits( amountA ?? '0', tokenA.decimals) : ethers.parseUnits( amountB ?? '0', tokenB.decimals)
    const amount1 = BigInt( token1.address ) === BigInt( tokenA.address ) ? ethers.parseUnits( amountA ?? '0', tokenA.decimals) : ethers.parseUnits( amountB ?? '0', tokenB.decimals)

    return { token0, token1, amount0, amount1 }
}

export const is_native = ( token: string ): boolean => {

    if ( token === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ) return true
    if ( token === TOKENS.weth9 )                                 return true

    return false
}

export const log_balances = async( signer: Wallet ) => {

    const Dai  = new Contract( TOKENS.dai   ?? ZeroAddress, ERC20_ABI, signer )
    const Usdc = new Contract( TOKENS.usdc  ?? ZeroAddress, ERC20_ABI, signer )
    const Usdt = new Contract( TOKENS.usdt  ?? ZeroAddress, ERC20_ABI, signer )
    const Weth = new Contract( TOKENS.weth9 ?? ZeroAddress, ERC20_ABI, signer )

    const nativeBalance = await signer.provider!.getBalance( signer.address ) 
    
    const daiBalance   = TOKENS.dai   ? await Dai.balanceOf( signer.address ) : undefined
    const usdcBalance  = TOKENS.usdc  ? await Usdc.balanceOf( signer.address ) : undefined
    const usdtBalance  = TOKENS.usdt  ? await Usdt.balanceOf( signer.address ) : undefined
    const wethBalance  = TOKENS.weth9 ? await Weth.balanceOf( signer.address ) : undefined

    console.log("\n")
    console.log( "Balance NATIVE: ", ethers.formatUnits( nativeBalance ) )
    console.log( "Balance DAI:    ", daiBalance !== undefined ? ethers.formatUnits( daiBalance ) : 'undefined' )
    console.log( "Balance USDC:   ", usdcBalance !== undefined ? ethers.formatUnits( usdcBalance, 6) : 'undefined' )
    console.log( "Balance USDT:   ", usdtBalance !== undefined ? ethers.formatUnits( usdtBalance, 6) : 'undefined' )
    console.log( "Balance WETH:   ", wethBalance !== undefined ? ethers.formatUnits( wethBalance, 18) : 'undefined' )
    console.log("\n")
}

export { swapUtils, addUtils }
