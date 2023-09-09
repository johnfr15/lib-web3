import { ethers } from "ethers"
import { CROSS_ADDRESS } from "../config/constant";
import { TxTransferArgs } from "../types";
import { ApproveCallData, CrossTransferCalldata } from "../types";
import { TICKER } from "../config/constant";
import { Uint256, uint256 } from "starknet";

export const starknet_transfer = async ( txArgs: TxTransferArgs ) => {
    
    const { starkSigner, network, fromChain, token, maker, amount, crossAddressExt } = txArgs

    try {

        const cross_address: string = CROSS_ADDRESS[ fromChain.id ]

        if ( cross_address === '' || cross_address === undefined )
            throw(`${ network } Cross transfer: Unknown cross address for chain ${ fromChain.name } need one for orbiter id: ${ fromChain.id }` )

    

        const crossTx: CrossTransferCalldata = get_crossTransfer_calldata( cross_address, token.address, maker.makerAddress, amount, crossAddressExt!.value )
        const approveTx: ApproveCallData     = get_approve_calldata( token.address, cross_address, amount )

        /*========================================= TX ================================================================================================*/
        console.log(`\nMulticall...`)
        console.log(`\t1) Approving ${ cross_address } to spend ( ${ ethers.formatUnits( amount, token.precision ) } * 1.1 ) ${ TICKER[ token.address ] }`)
        console.log(`\t2) Transfer ${ TICKER[token.address] } to ${ maker.makerAddress }`)      

        const { suggestedMaxFee } = await starkSigner.estimateInvokeFee( [ approveTx, crossTx ] );
        const multiCall           = await starkSigner.execute( [ approveTx, crossTx ], undefined, { maxFee: suggestedMaxFee } )
        const receipt: any        = await starkSigner.waitForTransaction( multiCall.transaction_hash );
        
        console.log(`\nTransaction valided !`)
        console.log("hash:            ", multiCall.transaction_hash)
        console.log("fees:            ", ethers.formatEther( receipt.actual_fee ) , "ETH")
        console.log("suggestedMaxFee: ", ethers.formatEther( suggestedMaxFee ), "ETH")
        /*=============================================================================================================================================*/
        
    } catch ( error ) {
        
        throw error

    }
}

export const get_approve_calldata = ( tokenAddress: string,  spender: string, amount: bigint ): ApproveCallData => {

    let uint_amount: Uint256 = uint256.bnToUint256( amount * BigInt(11) / BigInt(10) )


    const calldata: ApproveCallData = {
        contractAddress: tokenAddress,
        entrypoint: "approve",
        calldata: [ spender, uint_amount ],
    }

    return calldata

}

const get_crossTransfer_calldata = ( 
    crossAddress: string, 
    tokenAddress: string, 
    to: string, 
    amount: bigint, 
    ext: string 
): CrossTransferCalldata => {

    let uint_amount: Uint256 = uint256.bnToUint256( amount )

    const calldata: CrossTransferCalldata = {
        contractAddress: crossAddress,
        entrypoint: "transferERC20",
        calldata: [ tokenAddress, to, uint_amount, ext ],
    }

    return calldata

}