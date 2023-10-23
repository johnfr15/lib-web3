import StarknetWallet from "../Starknet/StarknetWallet"
import { MAINNET_PROVIDER, TESTNET_PROVIDER } from "../Starknet/StarknetWallet/Argent/constants"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {

    const Bravos = StarknetWallet.Bravos
    const OZContractClassHash = '0x058d97f7d76e78f44905cc30cb65b91ea49a4b908a76703c54197bca90f81773';

    const network = 'TESTNET'
    const provider = network === 'TESTNET' ? TESTNET_PROVIDER : MAINNET_PROVIDER

    const signer = await StarknetWallet.Utils.get_account( 0, provider )

    
    try {

        //========== FULL DEPLOYEMENT ==============================================================================

        await Bravos.full_deployment( signer, network )

        //==========================================================================================================




        //========== PARTIAL DEPLOYEMENT ===========================================================================
    
        // STEP 1: Pre compute keys and address
        // const id = await StarknetWallet.pre_compute( ARGENT_ACCOUNT_CONTRACT_CLASS_HASHES__NEW.CAIRO_1[0] )
        
        // STEP 2: Fund the newly computed contract address
        // const new_account = await StarknetWallet.get_account( id, TESTNET_PROVIDER )
        // await StarknetWallet.fund( "0x23ccb41f79ac59f8264cb14d6ce09e9d7b48ae7163264a62b7a17737bf1133e", '0.0002', signer, network )
        
        // STEP 3: Deploy the contract address 
        // await StarknetWallet.deploy_bravos( 2, TESTNET_PROVIDER )
        
        //==========================================================================================================
        
    } catch (error: any) {
  
        console.log( error )
  
    }
}
  
main()