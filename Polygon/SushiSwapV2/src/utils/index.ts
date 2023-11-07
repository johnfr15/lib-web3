import fs from "fs"
import { Token, Pool } from "../../types";
import { ethers, Wallet, Contract } from "ethers"
import { ERC20_ABI, TOKENS, CHAIN_ID, V2_FACTORY_ABI, V2_PAIR_ABI, V2_FACTORY} from "../../config/constants"


export const get_token = async( tokenAddress: string, network: 'TESTNET' | 'MAINNET' ): Promise<Token> => {

    const FILE_PATH = __dirname + "/../config/tokens.json"
    let Tokens: {[key: string]: Token } = {}

    if ( is_native( tokenAddress ) )
        tokenAddress = TOKENS[ network ].wmatic

    try {
        
        Tokens = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        
    } catch (error) {

        throw(`Error: ${ FILE_PATH } do not contains the tokens datas`)    

    }

    const token = Object.values(Tokens).find( (token: Token) => 
    {
        return  ( BigInt( token.address ) === BigInt( tokenAddress ) && token.chainId === CHAIN_ID[ network ]  )
    })


    if ( token === undefined )
        throw(`Error: Can't find token ${ tokenAddress } on network ${ network }, please add it to /Mute/config/tokens.ts`)
    

    return token
}

export const get_pool = async( tokenA: Token, tokenB: Token, signer: Wallet ): Promise<Pool> => {

    try {
        
        const Factory = new Contract( V2_FACTORY, V2_FACTORY_ABI, signer )
        const pair = await Factory.getPair( tokenA.address, tokenB.address )

        if ( BigInt( pair ) === BigInt( 0 ) )
            throw(`Error: pair for token ${ tokenA.symbol }/${ tokenB.symbol } not created yet.`)
    
        const Pair = new Contract( pair, V2_PAIR_ABI, signer )
    
        const { _reserve0, _reserve1 } = await Pair.getReserves()

        if ( BigInt( _reserve0 ) === BigInt( 0 ) )
            throw(`Error: Reserves is empty for pair ${ tokenA.symbol }/${ tokenB.symbol }.`)

        const { token0, token1 } = sort_tokens( tokenA, tokenB, '0', '0')
    
        const pool: Pool = {
            tokenA: token0,
            tokenB: token1,
            pair: pair,
            reserveA: _reserve0,
            reserveB: _reserve1,
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

export const get_quote = ( amountIn: string, tokenIn: Token, tokenOut: Token, pool: Pool): string => {

    const reserveIn: bigint  = BigInt( tokenIn.address )  === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB
    const reserveOut: bigint = BigInt( tokenOut.address ) === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB 

    const amount_in   = parseFloat( amountIn )
    const reserve_in  = parseFloat( ethers.formatUnits( reserveIn, tokenIn.decimals ) )
    const reserve_out = parseFloat( ethers.formatUnits( reserveOut, tokenOut.decimals ) )

    return (amount_in * reserve_out / reserve_in).toFixed( tokenOut.decimals )
}

export const is_native = ( token: string ): boolean => {
    return  (BigInt( token ) === BigInt( 0 ) || 
             BigInt( token ) === BigInt( TOKENS['TESTNET'].wmatic ) || 
             BigInt( token ) === BigInt( TOKENS['MAINNET'].wmatic )
            )
}


export const sort_tokens = ( tokenA: Token, tokenB: Token, amountA: string | null, amountB: string | null ): { token0: Token, token1: Token, amount0: bigint, amount1: bigint } => {

    const token0 = BigInt( tokenA.address ) < BigInt( tokenB.address ) ? tokenA : tokenB
    const token1 = BigInt( tokenA.address ) > BigInt( tokenB.address ) ? tokenA : tokenB 
    const amount0 = token0.address === tokenA.address ? ethers.parseUnits( amountA ?? '0', token0.decimals) : ethers.parseUnits( amountB ?? '0', token0.decimals)
    const amount1 = token1.address === tokenA.address ? ethers.parseUnits( amountA ?? '0', token1.decimals) : ethers.parseUnits( amountB ?? '0', token1.decimals)

    return { token0, token1, amount0, amount1 }
}

export const log_balances = async(signer: Wallet, network: 'TESTNET' | 'MAINNET') => {

    const Dai  = new Contract(TOKENS[ network ].dai, ERC20_ABI, signer)
    const Usdc = new Contract(TOKENS[ network ].usdc, ERC20_ABI, signer)
    const Usdt = new Contract(TOKENS[ network ].usdt, ERC20_ABI, signer)
    const Weth = new Contract(TOKENS[ network ].weth, ERC20_ABI, signer)

    const maticBalance = await signer.provider!.getBalance( signer.address ) 
    const daiBalance   = await Dai.balanceOf( signer.address ) 
    const usdcBalance  = await Usdc.balanceOf( signer.address ) 
    const usdtBalance  = await Usdt.balanceOf( signer.address ) 
    const wethBalance  = await Weth.balanceOf( signer.address ) 

    console.log("\n")
    console.log( "Balance MATIC: ", ethers.formatUnits( maticBalance ) )
    console.log( "Balance DAI:   ", ethers.formatUnits( daiBalance ) )
    console.log( "Balance USDC:  ", ethers.formatUnits( usdcBalance, 6) )
    console.log( "Balance USDT:  ", ethers.formatUnits( usdtBalance, 6) )
    console.log( "Balance WETH:  ", ethers.formatUnits( wethBalance, 18) )
    console.log("\n")
}