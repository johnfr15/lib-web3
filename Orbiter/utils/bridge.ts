import { Provider, Contract as StarkContract, Account } from "starknet"
import { Contract as SolContract, JsonRpcProvider, Wallet, ethers } from "ethers"
import maker1 from "../config/maker-1"
import makerTest1 from "../config/makerTest-1"
import { ERC20_SOL_ABI, ERC20_STARK_ABI, NETWORK_NAME_TO_ID, NETWORK_NAME_TO_ORBITERID, TICKER } from "../config/constant"
import { MarkerType, BridgeChain, Chains, BridgeToken, CrossAddressExt, OrbiterToken } from "../types"

export const get_chain = ( chain: Chains, network: string ): BridgeChain => {

    const chain_id   = NETWORK_NAME_TO_ORBITERID[ network ][ chain ]
    const chain_name = chain
    const network_id = NETWORK_NAME_TO_ID[ network ][ chain ]

    const bridge_chain: BridgeChain = {
        id: chain_id,
        name: chain_name,
        networkId: network_id
    }

    return bridge_chain
}

export const get_token = ( maker: MarkerType, chain: Chains, provider: Provider | JsonRpcProvider ): BridgeToken => {
    let contract: StarkContract | SolContract;

    if ( chain === "starknet" )
        contract = new StarkContract( ERC20_STARK_ABI, maker.fromTokenAddress, provider as Provider )
    else
        contract = new SolContract( maker.fromTokenAddress, ERC20_SOL_ABI, provider as JsonRpcProvider )

    const bridge_token: BridgeToken = {
        provider: provider,
        chainId: maker.fromChainId,
        name: maker.tokenName,
        precision: maker.fromPrecision,
        address: maker.fromTokenAddress,
        makerAddress: maker.makerAddress,
        contract: contract
    }

    return bridge_token
}

export const resolve_maker = ( token: string, fromChain: BridgeChain, toChain: BridgeChain, network: string ): any => {
    let searchMaker;
    const pair_token = TICKER[ token ] + '-' + TICKER[ token ]
    const pair_id = fromChain.id + '-' + toChain.id

    if ( network === "MAINNET" )
        searchMaker = Object.entries( maker1 ).find(( [ key, value ]: [string, Record<string, any>] ) => (pair_id === key && value[ pair_token ]) )
    if ( network === "TESTNET" )
        searchMaker = Object.entries( makerTest1 ).find(( [ key, value ]: [string, Record<string, any>] ) => (pair_id === key && value[ pair_token ]) )

    if ( searchMaker === undefined )
        throw(`${network}: Bridge from ${fromChain.name} to ${toChain.name} does not exist.`)

    const maker: Record<string, any> = searchMaker[1]

    return {
        makerAddress: maker[ pair_token ].makerAddress ?? maker[ pair_token ].sender,
        ...maker[ pair_token ],
        fromChainId: fromChain.id,
        toChainId: toChain.id,
        fromChainName: fromChain.name,
        toChainName: toChain.name,
        fromTokenAddress: token,
        tokenName: TICKER[ token ],
    }
}

/*
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
*/

/**
 * 
 * @dev
 *  If the exit address on the other chain is not the same we need to specify it as cross address
 * 
 */
export const resolve_cross_address = ( evmSigner: Wallet, starkSigner: Account, fromChain: BridgeChain, toChain: BridgeChain ): CrossAddressExt | undefined => {

    if ( fromChain.name === "starknet" && toChain.name !== "starknet" ) return { type: "0x01", value: evmSigner.address }
    if ( fromChain.name !== "starknet" && toChain.name === "starknet" ) return { type: "0x03", value: starkSigner.address }
    
    return undefined
}

export const append_network_target = ( payAmount: bigint, target: number): bigint => {

    let sliced = payAmount / 10000n

    let final_amount = (sliced * 10000n) + BigInt( target ) 

    return final_amount
}