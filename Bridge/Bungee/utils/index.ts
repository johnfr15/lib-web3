import chains from "../config/chains"
import { Wallet, JsonRpcProvider } from "ethers"
import { CHAIN_ID } from "../config/constants"
import { Chains, Token, ChainType } from "../type/types"
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