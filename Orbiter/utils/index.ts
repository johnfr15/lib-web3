import { Account, Contract as StarkContract, uint256, Provider } from "starknet";
import { JsonRpcProvider, Contract as SolContract , Wallet, ethers } from "ethers";
import { BridgeToken, ChainType } from "../types";
import * as chains from '../config/chains'
import { MAINNET_PROVIDER, TESTNET_PROVIDER } from "../config/constant";
import { is_native_token } from "./transfer";

export const get_balance = async( signer: Account | Wallet, token: BridgeToken ): Promise<string> => 
{
    let balance: any;

    if ( is_native_token( token.address ) )
    {
        const provider = token.provider as JsonRpcProvider
        balance = await provider.getBalance( signer.address )
        return ethers.formatUnits( balance, token.precision )
    }
    
    if ( token.contract instanceof StarkContract || token.contract instanceof SolContract )
        balance = await token.contract.balanceOf( signer.address )

    if ( typeof balance === 'object')
        balance = uint256.uint256ToBN( balance.balance )

    return ethers.formatUnits( balance, token.precision )
}

/**
 * 
 * @param chainId   // Orbiter id 
 */
export const resolve_provider = ( orbiterId: number ): JsonRpcProvider | Provider => {

    if ( orbiterId === 4 || orbiterId === 44)
        return orbiterId === 4 ? MAINNET_PROVIDER : TESTNET_PROVIDER

    const chain_info = <ChainType> Object.values(chains).find(( item ) => item.orbiterId === orbiterId )
    const provider = new JsonRpcProvider( chain_info.rpc[0] )

    return provider
}