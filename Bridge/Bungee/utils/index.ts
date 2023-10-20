import fs from "fs"
import { ethers, Wallet, Contract, JsonRpcProvider } from "ethers"
import { ERC20_ABI, CHAIN_ID, NATIVE_TOKEN, TOKENS, CHAIN_ID_TO_NAME } from "../config/constants"
import { Chains, Token, ChainType } from "../type/types"
import chains from "../config/chains"
import { get_supported_token } from "../api/Supported/token-support"


export const get_token = async( tokenAddress: string, chain: Chains ): Promise<Token> => {

    try {
        
        const token = await get_supported_token( CHAIN_ID[ chain ], tokenAddress )

        if ( token.isSupported === false )
            throw(`Error: Token ${ tokenAddress } on network ${ chain } is not supported`)

        return token.token

    } catch ( error: any ) {
        
        throw( error.response.data.error.message )

    }
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

export const is_native = ( token: string ): boolean => {

    if ( token === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ) 
        return true
    else
        return false
}


export const resolve_chain = ( signer: Wallet, chain: Chains ): Wallet => {

    const provider = resolve_provider( CHAIN_ID[ chain ] )
    signer = new Wallet( signer.privateKey, provider )

    return signer
}

/**
 * 
 * @param chainId   // Orbiter id 
 */
export const resolve_provider = ( chainId: number ): JsonRpcProvider => {

    const chain_info = <ChainType> Object.values( chains ).find(( item ) => parseInt( item.chainId ) === chainId )

    const provider = new JsonRpcProvider( chain_info!.rpc[0] )

    return provider
}