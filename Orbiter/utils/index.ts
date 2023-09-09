import { Account, Contract as StarkContract, uint256, Provider } from "starknet";
import { JsonRpcProvider, Contract as SolContract , Wallet, ethers } from "ethers";
import { BridgeToken, ChainType, TxTransferArgs } from "../types";
import chains from "../config/chains"
import { STARKNET_MAINNET_PROVIDER, STARKNET_TESTNET_PROVIDER, L1_TO_L2_MAKER_ADDRESSES, L2_TO_L1_MAKER_ADDRESSES } from "../config/constant";
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
        return orbiterId === 4 ? STARKNET_MAINNET_PROVIDER : STARKNET_TESTNET_PROVIDER

    const chain_info = <ChainType> Object.values( chains ).find(( item ) => parseInt( item.internalId ) === orbiterId )

    const provider = new JsonRpcProvider( chain_info!.rpc[0] )

    return provider
}

export const log_routes = ( txArgs: TxTransferArgs ) => {

    console.log("\nRoutes:")
    console.log(txArgs.maker)

    // From
    if ( txArgs.fromChain.name === "starknet" )
        console.log(`\tFrom ${ txArgs.fromChain.name}: ${ txArgs.starkSigner.address } => ${ txArgs.maker.makerAddress }`)
    else
        console.log(`\tFrom ${ txArgs.fromChain.name}: ${ txArgs.evmSigner.address } => ${ txArgs.maker.makerAddress }`)

    // To
    if ( txArgs.toChain.name === "starknet" )
        console.log(`\tTo ${ txArgs.toChain.name}: ${ L1_TO_L2_MAKER_ADDRESSES[ txArgs.maker.makerAddress ][ txArgs.network ] } => ${ txArgs.starkSigner.address }`)
    else
        console.log(`\tTo ${ txArgs.toChain.name }: ${ L2_TO_L1_MAKER_ADDRESSES[ txArgs.maker.makerAddress ][ txArgs.network ] } => ${ txArgs.evmSigner.address }`)
}