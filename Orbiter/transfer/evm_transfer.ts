import { Contract, JsonRpcProvider, Wallet, ethers } from "ethers";
import { CROSS_ADDRESS, CROSS_ADDRESS_ABI, ERC20_SOL_ABI, NETWORK_NAME_TO_ORBITERID } from "../config/constant";
import { is_native_token } from "../utils/transfer"
import { TxTransferArgs } from "../types";

export const evm_transfer = ( txArgs: TxTransferArgs ) => {
    
    if ( txArgs.crossAddressExt )
        cross_transfer( txArgs )
    else
        transfer ( txArgs )
}

// eth (native token) address from/to starknet address
export const cross_transfer = async( txArgs: TxTransferArgs ) => {

    const { evmSigner, network, fromChain, token, maker, amount } = txArgs

    try {

        const orbiter_id = NETWORK_NAME_TO_ORBITERID[ network ][ fromChain.name ]
        const cross_address = CROSS_ADDRESS[ orbiter_id ]
        if ( cross_address === '' )
            throw new Error(`cross transfer: Unknown cross address for network ${ txArgs.fromChain.name } need one for orbiter id: ${orbiter_id}` )
    
        evmSigner.connect( token.provider as JsonRpcProvider )
        const Cross_transfer = new Contract( cross_address, CROSS_ADDRESS_ABI, evmSigner )
        
        if ( is_native_token( token.address ) )
        {
            const tx = Cross_transfer.transfer()
            console.log("Cross transfer ")
        }
        else // It is an erc20
        {
    
        }
        
    } catch ( error ) {
        
        throw error

    }
}

export const transfer = async( txArgs: TxTransferArgs ) => {

    let tx, receipt;
    const { evmSigner, token, maker, amount } = txArgs
    console.log( token.provider )
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

        console.log("Transfer valided !")
        console.log("hash: ", tx.hash)
        
    } catch ( error ) {

        throw error
        
    }
}

export const approve_erc20 = ( txArgs: TxTransferArgs ) => {

}

