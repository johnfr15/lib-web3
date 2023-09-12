import { Account, Contract, Provider, constants } from "starknet"
import StarknetWallet from "../Starknet/StarknetWallet"
import dotenv from "dotenv"
import { MAINNET_PROVIDER } from "../Starknet/StarknetWallet/constants"

dotenv.config()


const main = async() => {

    const { TESTNET_PROVIDER, ARGENT_ACCOUTN_CLASS_HASH, OZ_ACCOUNT_CLASS_HASH } = StarknetWallet.Constant
    const OZContractClassHash = '0x058d97f7d76e78f44905cc30cb65b91ea49a4b908a76703c54197bca90f81773';

    const network = 'TESTNET'
    const provider = network === 'TESTNET' ? TESTNET_PROVIDER : MAINNET_PROVIDER

    const signer = await StarknetWallet.get_account( 0, provider )

    try {

        //========== FULL DEPLOYEMENT ==============================================================================

        // await StarknetWallet.deploy_wallet( signer, ARGENT_ACCOUTN_CLASS_HASH, network )

        //==========================================================================================================




        //========== PARTIAL DEPLOYEMENT ===========================================================================
        
        // STEP 1: Pre compute keys and address
        //const id = await StarknetWallet.pre_compute( OZContractClassHash )
        
        // STEP 2: Fund the newly computed contract address
        // const new_account = await StarknetWallet.get_account( 7, TESTNET_PROVIDER )
        // await StarknetWallet.fund( new_account.address, '0.0001', signer, network )
        
        // STEP 3: Deploy the contract address 
        await StarknetWallet.deploy_contract( 7, TESTNET_PROVIDER )
        
        //==========================================================================================================
        
    } catch (error: any) {
  
        console.log( error )
  
    }
}
  
main()