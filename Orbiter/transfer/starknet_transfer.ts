import { ethers } from "ethers"
import { CROSS_ADDRESS, L1_TO_L2_MAKER_ADDRESSES } from "../config/constant";
import { TxTransferArgs } from "../types";
import { ApproveCallData, CrossTransferCalldata } from "../types";
import { TICKER } from "../config/constant";

export const starknet_transfer = async ( txArgs: TxTransferArgs ) => {
    
    const { starkSigner, network, fromChain, token, maker, amount, crossAddressExt } = txArgs

    try {

        const cross_address: string = CROSS_ADDRESS[ fromChain.id ]
        const maker_L2: string      = L1_TO_L2_MAKER_ADDRESSES[ maker.makerAddress ]

        if ( cross_address === '' )
            throw(`${ network } Cross transfer: Unknown cross address for chain ${ fromChain.name } need one for orbiter id: ${ fromChain.id }` )
        if ( maker_L2 === undefined  )
            throw(`${ network } Can't find any starknet address for maker ${ maker.makerAddress }` )
    

        const crossTx: CrossTransferCalldata = get_crossTransfer_calldata( cross_address, token.address, maker_L2, amount, crossAddressExt!.value )
        const approveTx: ApproveCallData     = get_approve_calldata( token.address, cross_address, amount )

        /*========================================= TX ================================================================================================*/
        console.log(`\nMulticall...`)
        console.log(`\t1) Approving ${ cross_address } to spend ${ ethers.formatUnits( amount, token.precision ) } ${ TICKER[ token.address ] }`)
        console.log(`\t2) Transfer erc20 to ${ maker_L2 }`)      

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

    const calldata: ApproveCallData = {
        contractAddress: tokenAddress,
        entrypoint: "approve",
        calldata: [ spender, amount ],
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

    const calldata: CrossTransferCalldata = {
        contractAddress: crossAddress,
        entrypoint: "transferERC20",
        calldata: [ tokenAddress, to, amount, ext ],
    }

    return calldata

}