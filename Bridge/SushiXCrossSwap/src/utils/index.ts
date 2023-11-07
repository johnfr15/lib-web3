import fs from "fs";
import chains from "../../config/chains";
import { Chains, Token, ChainType } from "../../types";
import { ethers, Wallet, Contract, JsonRpcProvider } from "ethers";
import { ERC20_ABI, CHAIN_ID, TOKENS } from "../../config/constants";


export const get_token = async( tokenAddress: string, chain: Chains ): Promise<Token> => {

    const FILE_PATH = __dirname + "/../../config/tokens.json"
    let Tokens: { [ key in Chains ]: Token[] }

    try {
        
        Tokens = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        
    } catch (error) {

        throw(`Error: ${ FILE_PATH } do not contains the tokens datas`)    

    }

    const token = Tokens[ chain ].find( ( token: Token ) => 
    {
        if ( BigInt( token.address ) !== BigInt( tokenAddress ) ) return false
        if ( token.chainId !== CHAIN_ID[ chain ] )                return false

        return true
    })


    if ( token === undefined )
        throw(`Error: Can't find token ${ tokenAddress } on network ${ chain }, please add it to /Mute/config/tokens.ts`)


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

        if ( is_native( tokenAddress ))
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

export const is_native = ( token: string ): boolean => {
    return token === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
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