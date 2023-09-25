import { ethers, Wallet, Contract } from "ethers"
import { ERC20_ABI, CHAIN_ID } from "../config/constants"
import fs from "fs"
import { Token, WETH } from "@uniswap/sdk"

export const get_token = async( tokenAddress: string, network: 'TESTNET' | 'MAINNET' ): Promise<Token> => {

    const FILE_PATH = __dirname + "/../config/tokens.json"
    let Tokens: {[key: string]: Token } = {}

    if ( is_native( tokenAddress ) )
        tokenAddress = WETH[ CHAIN_ID[ network ] ]

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

export const is_native = ( token: string ): boolean => {
    return  ( BigInt( token ) === BigInt( 0 ) )
}