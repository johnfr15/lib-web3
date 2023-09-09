import { Account } from "starknet"
import { Wallet, ethers } from "ethers"
import Orbiter from "../Orbiter"
import dotenv from "dotenv"
import { Chains } from "../Orbiter/types"


dotenv.config()


const main = async() => {
    
    const { STARKNET_TESTNET_PROVIDER, STARKNET_MAINNET_PROVIDER, TOKENS } = Orbiter.Constant
    
    try {
        // Set up
        
        const evmSigner: Wallet = new ethers.Wallet( process.env.ETH_PRIVATE_KEY! )
        const starkSigner = new Account( STARKNET_TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )
        
        console.log("evm account:   ", evmSigner.address)
        console.log("stark account: ", starkSigner.address)
        
        const network: 'TESTNET' | 'MAINNET' = "MAINNET"
        const fromChain: Chains = "arbitrum"
        const toChain: Chains = "polygon"


        await Orbiter.swap({
            evmSigner,
            starkSigner,
            token: TOKENS[ network ][ fromChain ].eth,
            fromChain: fromChain,
            toChain: toChain,
            amount: "0.06",
            network
        })

    } catch (error: any) {
  
        console.log(error)
  
    }
}
  
main()