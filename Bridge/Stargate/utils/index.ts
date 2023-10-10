import fs from "fs"
import { ethers, Wallet, Contract, JsonRpcProvider } from "ethers"
import { ERC20_ABI, CHAIN_ID, NATIVE_TOKEN, TOKENS, CHAIN_ID_TO_NAME } from "../config/constants"
import { Chains, Token, ChainType } from "../types"
import chains from "../config/chains"


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
        throw(`Error: Can't find token ${ tokenAddress } on network ${ chain }.\nPlease add it to /AMM/PancakeSwapV3/config/tokens/${ chain }.json`)
    

    return token
}

export const get_native = async( chain: Chains ): Promise<Token> => {

    const FILE_PATH = __dirname + "/../config/tokens.json"
    let Tokens: { [ key in Chains ]: Token[] }

    try {
        
        Tokens = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        
    } catch (error) {

        throw(`Error: ${ FILE_PATH } do not contains the tokens datas`)    

    }

    const token = Tokens[ chain ].find( ( token: Token ) => 
    {
        if ( BigInt( token.address ) !== BigInt( NATIVE_TOKEN ) ) return false
        if ( token.chainId !== CHAIN_ID[ chain ] )                return false

        return true
    })


    if ( token === undefined )
        throw(`Error: Can't find native token on network ${ chain }, please add it to /Mute/config/tokens.ts`)


    return  token
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

export const is_native = ( token: string, chain: Chains ): boolean => {

    if ( token === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ) return true
    if ( token === TOKENS[ chain ].weth9 )                        return true

    return false
}

/**
 * 
 * @param chainId   // Orbiter id 
 */
export const resolve_provider = ( stargateId: number ): JsonRpcProvider => {

    const chain_info = <ChainType> Object.values( chains ).find(( item ) => parseInt( item.stargateId ) === stargateId )

    const provider = new JsonRpcProvider( chain_info!.rpc[0] )

    return provider
}

export const is_path = async( fromChain: string, toChain: string, fromToken: Token, toToken: Token ): Promise<boolean> => {

    const FILE_PATH = __dirname + "/../config/chainPath.json"
    let Paths

    if ( fromChain.endsWith('Testnet') ) fromChain = fromChain.split('Testnet')[0]
    if ( toChain.endsWith('Testnet') ) toChain = toChain.split('Testnet')[0]

    let path = toChain + '-' + toToken.symbol

    try {
        
        Paths = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        
    } catch (error) {

        throw(`Error: ${ FILE_PATH } do not contains the chain path datas.`)    

    }

    const token = Paths[ fromChain ][ fromToken.symbol ].find( ( tokenPath: string ) => 
    {
        return tokenPath === path
    })


    if ( token === undefined )
        return false

    return  true
}