import { Account, Contract, Provider, constants } from "starknet"
import StarknetWallet from "../Starknet/StarknetWallet"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    const OZContractClassHash = '0x058d97f7d76e78f44905cc30cb65b91ea49a4b908a76703c54197bca90f81773';

    const network = 'TESTNET'
    const { TESTNET_PROVIDER, ERC20_ABI, TOKENS } = StarknetWallet.Constant
    // const starkSigner = new Account( TESTNET_PROVIDER,  process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )
    const starkSigner = await StarknetWallet.get_account( 0, TESTNET_PROVIDER )

    try {

        // STEP 1: Pre compute keys and address
        const id = await StarknetWallet.pre_compute( OZContractClassHash )

        // STEP 2: Fund the newly computed contract address
        const new_account = await StarknetWallet.get_account( id, TESTNET_PROVIDER )
        await StarknetWallet.fund( new_account.address, '0.0001', starkSigner, network )

        // STEP 3: Deploy the contract address 
        await StarknetWallet.deploy_wallet( id, TESTNET_PROVIDER )

    } catch (error: any) {
  
        console.log( error )
  
    }
}
  
main()