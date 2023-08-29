import { Contract, JsonRpcProvider, Wallet, ethers } from "ethers";
import { CROSS_ADDRESS, CROSS_ADDRESS_ABI, ERC20_SOL_ABI, NETWORK_NAME_TO_ORBITERID } from "../config/constant";
import { is_native_token } from "../utils/transfer"
import { BridgeToken, TxTransferArgs } from "../types";
import { encode_ext } from "../utils/transfer";
import { TICKER } from "../config/constant";

export const evm_transfer = ( txArgs: TxTransferArgs ) => {
    
    if ( txArgs.crossAddressExt )
        cross_transfer( txArgs )
    else
        transfer ( txArgs )
}

// eth (native token) address to starknet address
export const cross_transfer = async( txArgs: TxTransferArgs ) => {

    const { evmSigner, network, fromChain, token, maker, amount, crossAddressExt } = txArgs
    const signer = new Wallet( evmSigner.privateKey, token.provider as JsonRpcProvider)
    let tx, receipt;

    try {

        const orbiter_id = NETWORK_NAME_TO_ORBITERID[ network ][ fromChain.name ]
        const cross_address = CROSS_ADDRESS[ orbiter_id ]
        if ( cross_address === '' )
            throw new Error(`cross transfer: Unknown cross address for network ${ txArgs.fromChain.name } need one for orbiter id: ${orbiter_id}` )
    
        const Cross_transfer = new Contract( cross_address, CROSS_ADDRESS_ABI, signer )
        const extHex = encode_ext( crossAddressExt! ) // Concat the target network + wallet's address
        const options = { value: "0x" + amount.toString(16) }

        
        if ( is_native_token( token.address ) )
        {
            console.log("\nCross transfer...")

            tx = await Cross_transfer.transfer( maker.makerAddress, extHex, options )
            receipt = await tx.wait()
        }
        else // It is an erc20
        {
            await approve_erc20( cross_address, token, amount, signer )

            console.log("\nCross transfer...")

            tx = await Cross_transfer.transferERC20( token.address, maker.makerAddress, options.value, extHex )
            receipt = await tx.wait()
        }

        console.log("Transaction valided !")
        console.log("Hash: ", tx.hash)
        
    } catch ( error ) {
        
        throw error

    }
}

export const transfer = async( txArgs: TxTransferArgs ) => {

    let tx, receipt;
    const { evmSigner, token, maker, amount } = txArgs
    const signer = new Wallet( evmSigner.privateKey, token.provider as JsonRpcProvider)

    try {

        if ( is_native_token( token.address ) )
        {
            const params = { to: maker.makerAddress, value: amount }

            tx = await signer.sendTransaction( params )
            receipt = await tx.wait()
        }
        else // it is an erc20
        {
            const contract = new Contract( token.address, ERC20_SOL_ABI, signer )
    
            tx = await contract.transfer( maker.makerAddress, amount )
            receipt = await tx.wait()
        }

        console.log("\nTransfer valided !")
        console.log("hash: ", tx.hash)
        
    } catch ( error ) {

        throw error
        
    }
}

export const approve_erc20 = async( target: string, token: BridgeToken, amount: bigint, signer: Wallet ) => {

    try {
        
        const erc20 = new Contract( token.address, ERC20_SOL_ABI, signer )
    
        console.log(`\nApproving ${target} to spend ${ ethers.formatUnits( amount, token.precision)} ${TICKER[token.address]}...`)
    
        // Approve amount + 10%
        const tx = await erc20.approve( target, (amount * BigInt( 11 )) / BigInt( 10 ))
        const receipt = await tx.wait()

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)

    } catch (error) {
     
        throw error

    }
}
