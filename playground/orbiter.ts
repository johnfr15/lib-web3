import { Account } from "starknet"
import { Wallet, ethers, BigNumberish } from "ethers"
import Orbiter from "../Orbiter"
import dotenv from "dotenv"
import { L1_TO_L2_MAKER_ADDRESSES } from "../Orbiter/config/constant"


dotenv.config()


const main = async() => {
    
    const { STARKNET_TESTNET_PROVIDER, STARKNET_MAINNET_PROVIDER, TOKENS } = Orbiter.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const evmSigner: Wallet = new ethers.Wallet( process.env.ETH_PRIVATE_KEY! )
        const starkSigner = new Account( STARKNET_TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )

        console.log("evm account:   ", evmSigner.address)
        console.log("stark account: ", starkSigner.address)
        console.log("")


        await Orbiter.swap({
            evmSigner,
            starkSigner,
            token: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            fromChain: "starknet",
            toChain: "optimism",
            amount: "0.01"
        })

    } catch (error: any) {
  
        console.log(error)
  
    }
}
  
main()