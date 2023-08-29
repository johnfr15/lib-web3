import { Wallet, ethers } from "ethers"
import { Account } from "starknet"
import { evm_transfer } from "./transfer/evm_transfer"
import { starknet_transfer } from "./transfer/starknet_transfer"
import { Chains, TxTransferArgs } from "./types"
import { get_chain, resolve_maker, get_token, resolve_cross_address, append_network_target } from "./utils/bridge"
import { get_amounts } from "./bridge"
import { get_balance, resolve_provider } from "./utils"
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
    network?: 'testnet' | 'mainnet' 
}) => {
    const network = swap.network ?? 'testnet'
    const max = swap.max ?? false
    const from_signer = swap.fromChain === "starknet" ? swap.starkSigner : swap.evmSigner

    if ( max === false && swap.amount === undefined)
        throw new Error("You need to specify an amount or set 'max' parameter to true.")

    const from_chain = get_chain(swap.fromChain, network)
    const to_chain = get_chain(swap.toChain, network)
    
    const cross_address = resolve_cross_address( swap.evmSigner, swap.starkSigner, from_chain, to_chain )
    const maker = resolve_maker( swap.token, from_chain, to_chain, network )

    const from_rpc = await resolve_provider( from_chain.id )
    const from_token = get_token( maker, swap.fromChain, from_rpc )
    const from_balance = await get_balance( from_signer, from_token )

    const amount = max ? from_balance : swap.amount!
    const { payAmount, receiveAmount } = get_amounts( from_token, maker, amount, max )

    // VERY IMPORTANT: we need to append this number to the last 4 digit of our pay amount
    // so the maker will know which network we want to send our tokens to.
    // See: https://docs.orbiter.finance/technology ("correct process")
    const network_target =  9000 + to_chain.id
    const final_amount = append_network_target( payAmount, network_target )

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
    console.log(`\nBridging token ${ TICKER[swap.token] } from ${ swap.fromChain } to ${ swap.toChain }...`)
    console.log(`\tpay amount:     ${ ethers.formatUnits( payAmount, maker.precision ) }`)
    console.log(`\treceive amount: ${ ethers.formatUnits( receiveAmount, maker.precision ) }`)

    if ( from_chain.name === "starknet" )
        starknet_transfer( txArgs )
    else
        evm_transfer( txArgs )
    
    // const { suggestedMaxFee } = await from_signer.estimateInvokeFee([ approveTx, withdrawTx ]);
    // const tx                  = await from_signer.execute([ approveTx, withdrawTx ], undefined, { maxFee: suggestedMaxFee })
    // const receipt: any        = await from_signer.waitForTransaction(multiCall.transaction_hash);
    
    // console.log(`\nTransaction valided !`)
    // console.log("hash:            ", tx.transaction_hash)
    // console.log("fees:            ", ethers.formatEther( receipt.actual_fee ) , "ETH")
    // console.log("suggestedMaxFee: ", ethers.formatEther( suggestedMaxFee ), "ETH")
    /*=============================================================================================================================================*/

    return (0)
}