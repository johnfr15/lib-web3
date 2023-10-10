import { Wallet, ethers, Contract } from "ethers";
import { Chains, BridgeOptions, BridgeTx, StargateParams, Token } from "../types";
import { is_path, get_balance, get_native, get_token } from "../utils";
import { getFee, get_router, get_stargate_params } from "../utils/bridge"
import { ROUTER, ROUTER_ABI, NATIVE_TOKEN } from "../config/constants";


export const get_bridge_tx = async(
    signer: Wallet,
    tokenFrom: string,
    tokenTo: string,
    fromChain: Chains, 
    toChain: Chains,
    amount: string | null,
    options: BridgeOptions,
): Promise<BridgeTx> => {

    try {

        if ( options?.max === false && amount === null )
            throw( `Error: in the options param you either need to specify "max" to true or set a number for 'amount'.`)
        
        const native: Token      = await get_native( fromChain )
        const token_from: Token  = await get_token( tokenFrom, fromChain )
        const token_to: Token    = await get_token( tokenTo, toChain )
        const balance_nativ      = await get_balance( NATIVE_TOKEN, signer )
        const balance_from       = await get_balance( tokenFrom, signer )
        const Router: Contract   = get_router( token_from, fromChain, signer )
        const big_amount: bigint = options?.max ? balance_from.bigint : ethers.parseUnits( amount!, token_from.decimals )

        
        if ( balance_from.bigint === BigInt( 0 ) )
            throw( `Error: Balance of token ${ token_from.symbol } is empty.`)

        if ( await is_path( fromChain, toChain, token_from, token_to ) === false )
            throw( `Error: Path not supported.\n\tFrom ${ fromChain }: ${ token_from.symbol }\n\tTo ${ toChain }: ${ token_to.symbol }`)


        let sp: StargateParams = get_stargate_params( signer, token_from, token_to, fromChain, toChain, big_amount, options.slipage! )
        const messageFee: bigint = await getFee( signer, sp, fromChain )

                
        if ( balance_nativ.bigint < messageFee )
            throw( `Error: Not enough balance of native token for paying message fee (${ ethers.formatEther( messageFee )} ${ fromChain === "polygon" ? "MATIC" : "ETH" }).`)



        const bridgeTx: BridgeTx = {
            signer: signer,
            Router: Router,
            payload: sp,
            messageFee: messageFee,
            utils: {
                native: native,
                tokenIn: token_from,
                fromChain: fromChain,
                toChain: toChain,
            },
        }

        return bridgeTx

    } catch (error: any) {
        
        throw error

    }
}
