import { Wallet, ethers, Contract } from "ethers";
import { get_balance, get_token } from "../utils";
import { SUSHI_X_SWAP_V2, SUSHI_X_SWAP_V2_ABI } from "../../config/constants";
import { getFee, get_bridge, get_stargate_params, encode_stp } from "../utils/bridge"
import { Chains, BridgeOptions, BridgeTx, StargateTeleportParams, Token, Bridge } from "../../types";


export const get_bridge_tx = async(
    signer: Wallet,
    tokenFrom: string,
    tokenTo: string,
    fromChain: Chains, 
    toChain: Chains,
    amount: string | null,
    options: BridgeOptions,
): Promise<BridgeTx> => {

    let stp: StargateTeleportParams

    try {

        if ( options?.max === false && amount === null )
            throw( `Error: in the options param you either need to specify "max" to true or set a number for 'amount'.`)
        

        const token_from: Token  = await get_token( tokenFrom, fromChain )
        const token_to: Token    = await get_token( tokenTo, toChain )
        const balance_from       = await get_balance( tokenFrom, signer )
        const big_amount: bigint = options?.max ? balance_from.bigint : ethers.parseUnits( amount!, token_from.decimals )

        
        if ( balance_from.bigint === BigInt( 0 ) )
            throw( `Error: Balance of token ${ token_from.symbol } is empty.`)


        stp                         = get_stargate_params( signer, token_from, token_to, fromChain, toChain, big_amount, options.slipage! )
        const stp_encoded: string   = encode_stp( stp )
        const bridge: Bridge        = get_bridge( signer, stp_encoded, token_from, fromChain, big_amount )
        const feesCost: bigint      = await getFee( signer, stp, fromChain )

        const SushiXSwapV2 = new Contract( SUSHI_X_SWAP_V2[ fromChain ], SUSHI_X_SWAP_V2_ABI, signer )

 
        const bridgeTx: BridgeTx = {
            signer: signer,
            SushiXSwapV2: SushiXSwapV2,
            fromChain: fromChain,
            toChain: toChain,
            bridge: bridge,
            tokenIn: token_from,
            stp: stp,
            feesCost: feesCost,
        }

        return bridgeTx

    } catch (error: any) {
        
        throw error

    }
}
