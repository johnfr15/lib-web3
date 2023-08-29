import { Provider, Contract as StarkContract, Account } from "starknet"
import { Contract as SolContract, JsonRpcProvider, Wallet, ethers } from "ethers"
import * as m_makers from "../config/makerListMainnet"
import * as t_makers from "../config/makerListTestnet"
import { ERC20_SOL_ABI, ERC20_STARK_ABI, NETWORK_NAME_TO_ID, NETWORK_NAME_TO_ORBITERID, TICKER } from "../config/constant"
import { MarkerType, BridgeChain, Chains, BridgeToken, CrossAddressExt } from "../types"

export const get_chain = ( chain: Chains, network: string ): BridgeChain => {

    const chain_id   = NETWORK_NAME_TO_ORBITERID[network][chain]
    const chain_name = chain
    const network_id = NETWORK_NAME_TO_ID[network][chain]

    const bridge_chain: BridgeChain = {
        id: chain_id,
        name: chain_name,
        networkId: network_id
    }

    return bridge_chain
}

export const get_token = ( maker: MarkerType, chain: Chains, provider: Provider | JsonRpcProvider ): BridgeToken => {
    let contract;

    if ( chain === "starknet" )
        contract = new StarkContract( ERC20_STARK_ABI, maker.fromTokenAddress, provider as Provider )
    else
        contract = new SolContract( maker.fromTokenAddress, ERC20_SOL_ABI, provider as JsonRpcProvider )

    const bridge_token: BridgeToken = {
        provider: provider,
        chainId: maker.fromChainId,
        name: maker.tokenName,
        address: maker.fromTokenAddress,
        precision: maker.precision,
        makerAddress: maker.makerAddress,
        contract: contract
    }

    return bridge_token
}

export const resolve_maker = ( token: string, fromChain: BridgeChain, toChain: BridgeChain, network: string ): MarkerType => {
    let searchMaker;

    if ( network === "mainnet" )
    {
        searchMaker = Object.values( m_makers ).find(( maker ) => {
            if ( maker.c1ID === fromChain.id && maker.c2ID === toChain.id && maker.t1Address === token ) return true
            if ( maker.c2ID === fromChain.id && maker.c1ID === toChain.id && maker.t2Address === token ) return true
            return false
        })
    }
    if ( network === "testnet" )
    {
        searchMaker = Object.values( t_makers ).find(( maker ) => {
            if ( maker.c1ID === fromChain.id && maker.c2ID === toChain.id && maker.t1Address === token ) return true
            if ( maker.c2ID === fromChain.id && maker.c1ID === toChain.id && maker.t2Address === token ) return true
            return false
        })
    }

    if ( searchMaker === undefined )
        throw new Error(`resolve_maker: Bridge from ${fromChain.name} to ${toChain.name} does not exist.`)

    const makers = expand( searchMaker )

    // Find the right position (from/to)
    const maker = fromChain.id === makers[0].fromChainId ? makers[0] : makers[1]

    return ( maker )
}

export const expand = ( makerListItem: typeof t_makers.t_starknet_arbitrum_eth | typeof m_makers.m_starknet_arbitrum_eth ): [ MarkerType, MarkerType ] => {
    return [
        {
          makerAddress: makerListItem.makerAddress,
          fromChainId: makerListItem.c1ID,
          toChainId: makerListItem.c2ID,
          fromChainName: makerListItem.c1Name,
          toChainName: makerListItem.c2Name,
          fromTokenAddress: makerListItem.t1Address,
          toTokenAddress: makerListItem.t2Address,
          tokenName: makerListItem.tName,
          minPrice: makerListItem.c1MinPrice,
          maxPrice: makerListItem.c1MaxPrice,
          precision: makerListItem.precision,
          avalibleDeposit: makerListItem.c1AvalibleDeposit,
          tradingFee: makerListItem.c1TradingFee,
          gasFee: makerListItem.c1GasFee,
          avalibleTimes: makerListItem.c1AvalibleTimes,
        },
        {
          makerAddress: makerListItem.makerAddress,
          fromChainId: makerListItem.c2ID,
          toChainId: makerListItem.c1ID,
          fromChainName: makerListItem.c2Name,
          toChainName: makerListItem.c1Name,
          fromTokenAddress: makerListItem.t2Address,
          toTokenAddress: makerListItem.t1Address,
          tokenName: makerListItem.tName,
          minPrice: makerListItem.c2MinPrice,
          maxPrice: makerListItem.c2MaxPrice,
          precision: makerListItem.precision,
          avalibleDeposit: makerListItem.c2AvalibleDeposit,
          tradingFee: makerListItem.c2TradingFee,
          gasFee: makerListItem.c2GasFee,
          avalibleTimes: makerListItem.c2AvalibleTimes,
        },
    ]
}

/**
 * 
 * @dev
 *  If the exit address on the other chain is not the same we need to specify it as cross address
 * 
 */
export const resolve_cross_address = ( evmSigner: Wallet, starkSigner: Account, fromChain: BridgeChain, toChain: BridgeChain ): CrossAddressExt | undefined => {

    if ( fromChain.name === "starknet" && toChain.name !== "starknet" )
        return { type: "0x01", value: evmSigner.address }
    if ( fromChain.name !== "starknet" && toChain.name === "starknet" )
        return { type: "0x02", value: starkSigner.address }
    else
        return undefined
}

export const append_network_target = ( payAmount: bigint, target: number): bigint => {

    let sliced = payAmount / 10000n

    let final_amount = (sliced * 10000n) + BigInt( target ) 

    return final_amount
}