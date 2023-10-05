import fs from "fs"
import { ethers, Wallet, Contract, JsonRpcProvider } from "ethers"
import { ERC20_ABI, TOKENS, CHAIN_ID, QUOTER_V2, QUOTER_V2_ABI, CHAIN_ID_TO_NAME, FACTORY, FACTORY_ABI, POOL_ABI } from "../config/constants"
import { Token, Pool, Chains, Fees } from "../types";
import chains from "../config/chains"


export const get_signer = ( signer: Wallet, chain: Chains ): Wallet => {

    const provider = resolve_provider( CHAIN_ID[ chain ] )
    signer = new Wallet( signer.privateKey, provider )

    return signer
}
export const get_token = async( tokenAddress: string, chain: Chains ): Promise<Token> => {

    const FILE_PATH = __dirname + "/../config/tokens/" + chain + '.json'
    let Tokens: {[key: string]: Token } = {}

    if ( is_native( tokenAddress, chain ) )
        tokenAddress = TOKENS[ chain ].weth9

    try {
        
        Tokens = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        
    } catch (error) {

        throw(`Error: ${ FILE_PATH } do not contains the tokens datas`)    

    }

    const token = Object.values(Tokens).find( (token: Token) => 
    {
        if ( BigInt( token.address ) !== BigInt( tokenAddress ) ) return false
        if ( token.chainId !== CHAIN_ID[ chain ] )               return false

        return true
    })


    if ( token === undefined )
        throw(`Error: Can't find token ${ tokenAddress } on network ${ chain }, please add it to /Mute/config/tokens.ts`)
    

    return token
}


/**
 * 
 * @param chainId   // Orbiter id 
 */
export const resolve_provider = ( chainId: number ): JsonRpcProvider => {

    const chain_info = Object.values( chains ).find(( item ) => parseInt( item.chainId ) === chainId )

    const provider = new JsonRpcProvider( chain_info!.rpc[0] )

    return provider
}


export const get_pool = async( tokenA: Token, tokenB: Token, signer: Wallet, chain: Chains ): Promise<Pool> => {

    try {
        
        const QuoterV2 = new Contract( QUOTER_V2[ chain ], QUOTER_V2_ABI, signer )
        const Factory = new Contract( FACTORY[ chain ], FACTORY_ABI, signer )
        const pair = await Factory.getPool( tokenA.address, tokenB.address, Fees.SMALL )

        
        if ( BigInt( pair ) === BigInt( 0 ) )
        throw(`Error: pair for token ${ tokenA.symbol }/${ tokenB.symbol } not created yet.`)
    
    
        const Pool = new Contract( pair, POOL_ABI, signer )
        const [ fee, slot0, liquidity, tickSpacing, ] = await Promise.all([
            Pool.fee(),
            Pool.slot0(),
            Pool.liquidity(),
            Pool.tickSpacing(),
        ])
        const { token0, token1 } = sort_tokens( tokenA, tokenB, '0', '0')

    
        const pool: Pool = {
            tokenA: token0,
            tokenB: token1,
            pair: pair,
            fees: fee,
            tickSpacing: tickSpacing,
            liquidity: liquidity,
            sqrtPriceX96: slot0[0],
            tick: slot0[1],
            Quoter: QuoterV2,
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

    try {

        const erc20 = new Contract(tokenAddress, ERC20_ABI, signer);
        const network = await signer.provider?.getNetwork()

        if ( is_native( tokenAddress, CHAIN_ID_TO_NAME[ parseInt( network!.chainId.toString() ) ]  ) )
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

    } catch (error: any) {

        throw new Error(error)

    }

}

export const is_balance = async(signer: Wallet, addressA: string, addressB: string): Promise<number> => {

    try {

        const balanceA = await get_balance( addressA, signer )
        const balanceB = await get_balance( addressB, signer )

        if ( balanceA.string === '0.0' || balanceB.string === '0.0' )
            return 0;
        else
            return 1;
        
    } catch (error: any) {
        
        throw error

    }
}


export const sort_tokens = ( tokenA: Token, tokenB: Token, amountA: string | null, amountB: string | null ): { token0: Token, token1: Token, amount0: bigint, amount1: bigint } => {

    const token0 = BigInt( tokenA.address ) < BigInt( tokenB.address ) ? tokenA : tokenB
    const token1 = BigInt( tokenA.address ) > BigInt( tokenB.address ) ? tokenA : tokenB 
    const amount0 = token0.address === tokenA.address ? ethers.parseUnits( amountA ?? '0', token0.decimals) : ethers.parseUnits( amountB ?? '0', token0.decimals)
    const amount1 = token1.address === tokenA.address ? ethers.parseUnits( amountA ?? '0', token1.decimals) : ethers.parseUnits( amountB ?? '0', token1.decimals)

    return { token0, token1, amount0, amount1 }
}

export const is_native = ( token: string, chain: Chains ): boolean => {

    if ( token === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ) return true
    if ( token === TOKENS[ chain ].weth9 )                        return true

    return false
}