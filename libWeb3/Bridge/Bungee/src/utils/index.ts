import { ethers, Contract } from "ethers"
import chains from "../../config/chains"
import { Wallet, JsonRpcProvider } from "ethers"
import { CHAIN_ID, TOKENS, ERC20_ABI } from "../../config/constants"
import { Chains, Token, ChainType } from "../../types/types"
import { get_supported_token } from "../../api/Supported/token-support"


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

export const log_balances = async(signer: Wallet, chain: Chains) => {

    const Dai  = new Contract(TOKENS[ chain ].dai, ERC20_ABI, signer)
    const Usdc = new Contract(TOKENS[ chain ].usdc, ERC20_ABI, signer)
    const Usdt = new Contract(TOKENS[ chain ].usdt, ERC20_ABI, signer)
    const Weth = new Contract(TOKENS[ chain ].weth9, ERC20_ABI, signer)

    const nativeBalance = await signer.provider!.getBalance( signer.address ) 
    const daiBalance    = await Dai.balanceOf( signer.address ) 
    const usdcBalance   = await Usdc.balanceOf( signer.address ) 
    const usdtBalance   = await Usdt.balanceOf( signer.address ) 
    const wethBalance   = await Weth.balanceOf( signer.address ) 

    console.log("\n")
    console.log( "Balance NATIVE: ", ethers.formatUnits( nativeBalance ) )
    console.log( "Balance DAI:    ", ethers.formatUnits( daiBalance ) )
    console.log( "Balance USDC:   ", ethers.formatUnits( usdcBalance, 6) )
    console.log( "Balance USDT:   ", ethers.formatUnits( usdtBalance, 6) )
    console.log( "Balance WETH:   ", ethers.formatUnits( wethBalance, 18) )
    console.log("\n")
}