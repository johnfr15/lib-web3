import { ethers } from "ethers"
import { Contract, Account } from "starknet";
import { CROSS_ADDRESS, CROSS_ADDRESS_ABI, ERC20_STARK_ABI, NETWORK_NAME_TO_ORBITERID } from "../config/constant";
import { is_native_token } from "../utils/transfer"
import { BridgeToken, TxTransferArgs } from "../types";
import { encode_ext } from "../utils/transfer";
import { TICKER } from "../config/constant";

export const starknet_transfer = ( txArgs: TxTransferArgs ) => {
    
    cross_transfer( txArgs )
}

// eth (native token) address to evm network address
export const cross_transfer = async( txArgs: TxTransferArgs ) => {

    const { starkSigner, network, fromChain, token, maker, amount, crossAddressExt } = txArgs
    let tx, receipt;

    try {

        const orbiter_id = NETWORK_NAME_TO_ORBITERID[ network ][ fromChain.name ]
        const cross_address = CROSS_ADDRESS[ orbiter_id ]
        if ( cross_address === '' )
            throw new Error(`cross transfer: Unknown cross address for network ${ txArgs.fromChain.name } need one for orbiter id: ${orbiter_id}` )
    
        const Cross_transfer = new Contract( CROSS_ADDRESS_ABI, cross_address, starkSigner )
        const extHex = encode_ext( crossAddressExt! ) // Concat the target network + wallet's address
        const options = { value: "0x" + amount.toString(16) }

        
        if ( is_native_token( token.address ) )
        {
            console.log("\nCross transfer...")

            tx = await Cross_transfer.transfer( maker.makerAddress, extHex, options )
            await starkSigner.waitForTransaction
        }
        else // It is an erc20
        {
            await approve_erc20( cross_address, token, amount, starkSigner )

            console.log("\nCross transfer...")

            tx = await Cross_transfer.functions.transferERC20( token.address, maker.makerAddress, options.value, extHex )
            await starkSigner.waitForTransaction( tx.hash )
        }

        console.log("Transaction valided !")
        console.log("Hash: ", tx.hash)
        
    } catch ( error ) {
        
        throw error

    }
}

export const approve_erc20 = async( target: string, token: BridgeToken, amount: bigint, signer: Account ) => {

    try {
        
        const erc20 = new Contract( ERC20_STARK_ABI, token.address, signer )
    
        console.log(`\nApproving ${target} to spend ${ ethers.formatUnits( amount, token.precision)} ${TICKER[token.address]}...`)
    
        // Approve amount + 10%
        const tx = await erc20.functions.approve( target, (amount * BigInt( 11 )) / BigInt( 10 ))
        await signer.waitForTransaction( tx.hash )

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)

    } catch (error) {
     
        throw error

    }
}
