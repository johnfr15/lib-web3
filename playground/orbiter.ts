import { Account, Contract, Provider } from "starknet"
import { Wallet, ethers } from "ethers"
import Orbiter from "../Orbiter"
import dotenv from "dotenv"
import { Chains } from "../Orbiter/types"
import { ERC20_STARK_ABI } from "../Orbiter/config/constant"


dotenv.config()


const main = async() => {
    
    const { STARKNET_TESTNET_PROVIDER, STARKNET_MAINNET_PROVIDER, TOKENS } = Orbiter.Constant
    
    try {
        // Set up
        
        const evmSigner: Wallet = new ethers.Wallet( process.env.ETH_PRIVATE_KEY! )
        const starkSigner = new Account( STARKNET_MAINNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )

        // const TEST_evmSigner: Wallet = new ethers.Wallet( process.env.TEST_ETH_PRIVATE_KEY! )
        // const TEST_starkSigner = new Account( STARKNET_MAINNET_PROVIDER, process.env.TEST_STARK_PUBLIC_KEY!, process.env.TEST_STARK_PRIVATE_KEY! )
        // console.log("evm account:   ", TEST_evmSigner.address)
        // console.log("stark account: ", TEST_starkSigner.address)

        
        const fromChain: Chains = "arbitrum"
        const toChain: Chains = "polygon"
        const network: 'TESTNET' | 'MAINNET' = "MAINNET"

        await Orbiter.swap({
            evmSigner,
            starkSigner,
            token: TOKENS[ network ][ "starknet" ].eth,
            fromChain: "starknet",
            toChain: "arbitrum",
            amount: "0.008",
            network
        })

        // await Orbiter.swap({
        //     evmSigner,
        //     starkSigner,
        //     token: TOKENS[ network ][ "arbitrum" ].eth,
        //     fromChain: "arbitrum",
        //     toChain: "optimism",
        //     amount: "0.005",
        //     network
        // })

        // await Orbiter.swap({
        //     evmSigner,
        //     starkSigner,
        //     token: TOKENS[ network ][ fromChain ].eth,
        //     fromChain: fromChain,
        //     toChain: toChain,
        //     amount: "0.01",
        //     network
        // })

    } catch (error: any) {
  
        console.log(error)
  
    }
}
  
main()