import { Wallet, ethers } from "ethers"
import { Account, Signer } from "starknet"
import { evm_transfer } from "./transfer/evm_transfer"
import { starknet_transfer } from "./transfer/starknet_transfer"
import { Chains, TxTransferArgs, OrbiterToken } from "./types"
import { get_chain, resolve_maker, get_token, resolve_cross_address, append_network_target } from "./utils/bridge"
import { get_amounts } from "./bridge"
import { get_balance, log_routes, resolve_provider } from "./utils"
import { TICKER } from "./config/constant"






/**
 * @name swap
 * @param evmSigner     // etherjs Wallet instance
 * @param starkSigner   // starknet Account instance
 * @param token         // Address of token to be swapped
 * @param fromChain     // Source network's name
 * @param toChain       // Destination network's name
 * @param amount        // (optional) Amount to be sent
 * @param max           // (optional) If set to true, will try to bridge all the balance of the signer
 * @param network       // (optional) In testnet or mainnet
 * 
 */
export const swap = async( swap: {
    evmSigner: Wallet,
    starkSigner: Account,
    token: string,
    fromChain: Chains, 
    toChain: Chains,
    
    amount?: string,
    max?: boolean,
    network?: 'TESTNET' | 'MAINNET' 
}) => {
    const network = swap.network ?? 'TESTNET'
    const max = swap.max ?? false
    const from_signer = swap.fromChain === "starknet" ? swap.starkSigner : swap.evmSigner

    if ( max === false && swap.amount === undefined)
        throw("You need to specify an amount or set 'max' parameter to true.")

    const from_chain = get_chain(swap.fromChain, network)
    const to_chain   = get_chain(swap.toChain, network)
    
    const maker = resolve_maker( swap.token, from_chain, to_chain, network )
    
    const from_provider = resolve_provider( from_chain.id )
    const from_token    = get_token( maker, swap.fromChain, from_provider )
    const from_balance  = await get_balance( from_signer, from_token )

    const amount = max ? from_balance : swap.amount!
    const { payAmount, receiveAmount } = get_amounts( from_token, maker, amount, max )

    // VERY IMPORTANT: we need to append this number to the last 4 digit of our pay amount
    // so the maker will know which network we want to send our tokens to.
    // See: https://docs.orbiter.finance/technology ("correct process")
    const network_target =  9000 + to_chain.id
    const final_amount = append_network_target( payAmount, network_target )
    
    const cross_address = resolve_cross_address( swap.evmSigner, swap.starkSigner, from_chain, to_chain )
    
    const txArgs: TxTransferArgs = {
        evmSigner: swap.evmSigner,
        starkSigner: swap.starkSigner,
        token: from_token,
        amount: final_amount, 
        fromChain: from_chain,
        toChain: to_chain,
        maker: maker,
        crossAddressExt: cross_address,
        network: network
    }

    /*========================================= TX ================================================================================================*/
    console.log(`\nBridging token ${ TICKER[swap.token] } from ${ swap.fromChain } to ${ swap.toChain }`)
    console.log(`\tpay amount:     ${ ethers.formatUnits( payAmount, maker.fromPrecision ) } ${ TICKER[ swap.token ]}`)
    console.log(`\treceive amount: ${ ethers.formatUnits( receiveAmount, maker.toPrecision ) } ${ TICKER[ swap.token ]}`)
    console.log("\nNetwork:          ", network )
    console.log("Withholding fees: ", maker.tradingFee.toString(), "ETH" )
    console.log("Id code:          ", network_target + '')
    log_routes( txArgs )

    if ( from_chain.name === "starknet" )
        starknet_transfer( txArgs )
    else
        evm_transfer( txArgs )
    /*=============================================================================================================================================*/

    return (0)
}