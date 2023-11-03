import fs from "fs"
import * as addUtils from "./add"
import * as swapUtils from "./swap"
import * as removeUtils from "./remove"
import chains from "../../config/chains"
import { BEST_FEE_POOL } from "../../config/feePool"
import { Token, Pool, Chains, State, Point, Fees } from "../../types"
import { ethers, Wallet, Contract, JsonRpcProvider, ZeroAddress} from "ethers"
import { ERC20_ABI, TOKENS, CHAIN_ID, CONTRACTS, QUOTER_ABI, CHAIN_ID_TO_NAME, POOL_ABI, LIQUIDITY_MANAGER_ABI } from "../../config/constants"



export const resolve_chain = ( signer: Wallet, chain: Chains ): Wallet => {

    const provider = resolve_provider( CHAIN_ID[ chain ] )
    signer = new Wallet( signer.privateKey, provider )

    return signer
}

export const get_token = async( tokenAddress: string, chain: Chains ): Promise<Token> => {

    const FILE_PATH = __dirname + "/../../config/tokens/" + chain + '.json'
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
        if ( token.chainId !== CHAIN_ID[ chain ] )                return false

        return true
    })


    if ( token === undefined )
        throw(`Error: Can't find token ${ tokenAddress } on network ${ chain }, please add it to /Mute/config/tokens.ts`)
    

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
export const get_pool = async( tokenA: Token, tokenB: Token, signer: Wallet, chain: Chains, fee?: Fees ): Promise<Pool> => {

    try {
        
        const Quoter = new Contract( CONTRACTS[ chain ].periphery.quoterWithoutLimit, QUOTER_ABI, signer )
        const NftManager = new Contract( CONTRACTS[ chain ].periphery.liquidityManager, LIQUIDITY_MANAGER_ABI, signer )

        // Fetch best fee from our config
        const bestFee = get_best_fee( tokenA, tokenB, chain )
        const { token0, token1 } = sort_tokens( tokenA, tokenB, '0', '0' )
        // This wil fetch and return the address of the pool
        const pair: string = await NftManager.pool( token0.address, token1.address, fee ?? bestFee )
        
        const Pool = new Contract( pair, POOL_ABI, signer )


        if ( pair === ZeroAddress )
            throw new Error( `Error: pool ${tokenA.symbol}/${tokenB.symbol} Fee ${ fee ?? bestFee } does not exist.`)

        
        const state = await get_state( Pool )
        // Here point refer to the current Tick of the pool 
        const point = await get_point( Pool, state )
    
        const pool: Pool = {
            tokenX: token0,
            tokenY: token1,
            pairAddress: pair,
            fees: fee ?? bestFee,
            state: state,
            point: point,
            Quoter: Quoter,
            Pool: Pool
        }
    
        return pool

    } catch (error) {
        
        throw( error )

    }
}

export const get_state = async( Pool: Contract ): Promise<State> => {

    try {

        const stateKeys = ['sqrtPrice_96', 'currentPoint', 'observationCurrentIndex', 'observationQueueLen', 
            'observationNextQueueLen', 'locked', 'liquidity', 'liquidityX']
        const stateValues = await Pool.state()

        const state: State = Object.fromEntries( stateKeys.map( (key, index) => [key, stateValues[index]] ) ) as State

        return state 

    } catch (error) {
        
        throw( error )
    }
}

export const get_point = async( Pool: Contract, state: State ): Promise<Point> => {

    try {

        const pointKeys = ['liquidSum', 'liquidDelta', 'accFeeXOut_128', 'accFeeYOut_128', 'isEndpt']
        const pointValues = await Pool.points( state.currentPoint )

        const point: Point = Object.fromEntries( pointKeys.map( (key, index) => [key, pointValues[index]] ) ) as Point

        return point 

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

    } catch (error) {

        throw( error )

    }

}

export const get_quote = ( amountA: number, tokenA: Token, pool: Pool ): bigint => {

    const { sqrtPrice_96 } = pool.state

    const x =  pool.tokenX
    const y =  pool.tokenY

    // see https://ethereum.stackexchange.com/questions/9868 5/computing-the-uniswap-v3-pair-price-from-q64-96-number
    // see https://www.youtube.com/watch?v=hKhdQl126Ys
    const priceX96_to_price0 = (parseFloat( sqrtPrice_96.toString() ) /  2 ** 96) ** 2

    const priceX = priceX96_to_price0 * ( (10 ** x.decimals) / (10 ** y.decimals) )
    const priceY = 1 / priceX

    const token_price = BigInt( tokenA.address ) === BigInt( x.address ) ? priceX : priceY
    
    const token_quoted = BigInt( tokenA.address ) === BigInt( x.address ) ? y : x
    const quote = (token_price * amountA).toFixed( token_quoted.decimals )

    const amountB = ethers.parseUnits( quote, token_quoted.decimals )
    
    return amountB
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

export const is_native = ( token: string, chain: Chains ): boolean => {

    if ( token === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ) return true
    if ( token === TOKENS[ chain ].weth9 )                        return true

    return false
}

const get_best_fee = ( tokenA: Token, tokenB: Token, chain: Chains ): number => {

    const pool = tokenA.symbol + '_' + tokenB.symbol

    const bestFee = BEST_FEE_POOL[ chain ][ pool ]

    if ( bestFee === undefined )
        throw(`Error: Unknown best fee for pool ${ pool } on ${ chain }`)

    return bestFee
}

export const log_balances = async(signer: Wallet, chain: Chains) => {

    const Dai  = new Contract( TOKENS[ chain ].dai   ?? ZeroAddress, ERC20_ABI, signer )
    const Usdc = new Contract( TOKENS[ chain ].usdc  ?? ZeroAddress, ERC20_ABI, signer )
    const Usdt = new Contract( TOKENS[ chain ].usdt  ?? ZeroAddress, ERC20_ABI, signer )
    const Weth = new Contract( TOKENS[ chain ].weth9 ?? ZeroAddress, ERC20_ABI, signer )

    const nativeBalance = await signer.provider!.getBalance( signer.address ) 
    
    const daiBalance   = TOKENS[ chain ].dai   ? await Dai.balanceOf( signer.address ) : 'undefined'
    const usdcBalance  = TOKENS[ chain ].usdc  ? await Usdc.balanceOf( signer.address ) : 'undefined'
    const usdtBalance  = TOKENS[ chain ].usdt  ? await Usdt.balanceOf( signer.address ) : 'undefined'
    const wethBalance  = TOKENS[ chain ].weth9 ? await Weth.balanceOf( signer.address ) : 'undefined'

    console.log("\n")
    console.log( "Balance NATIVE: ", ethers.formatUnits( nativeBalance ) )
    console.log( "Balance DAI:    ", ethers.formatUnits( daiBalance ) )
    console.log( "Balance USDC:   ", ethers.formatUnits( usdcBalance, 6) )
    console.log( "Balance USDT:   ", ethers.formatUnits( usdtBalance, 6) )
    console.log( "Balance WETH:   ", ethers.formatUnits( wethBalance, 18) )
    console.log("\n")
}

export default { swapUtils, addUtils, removeUtils }
