import { Account } from "starknet"
import { Wallet, ethers } from "ethers"
import Orbiter from "../Orbiter"
import MySwap from "../MySwap"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKEN, NETWORK_NAME_TO_ID } = Orbiter.Constant
    try {
        // Set up
        const network: 'testnet' | 'mainnet' = "testnet" // Testnet | Mainnet

        const evmSigner: Wallet = new ethers.Wallet( process.env.ETH_PRIVATE_KEY! )
        const starkSigner = new Account( TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )

        console.log("bridging from account: ", evmSigner.address)
        console.log("to account:            ", starkSigner.address)

 
        await Orbiter.swap({
            evmSigner,
            starkSigner,
            token: TOKEN.eth.starknet, 
            fromChain: 'arbitrum',
            toChain: 'polygon',
            amount: '0.006',
            // max: true,
        })

    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()