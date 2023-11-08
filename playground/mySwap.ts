import { Account } from "starknet"
import MySwap from "../Starknet/MySwap"
import dotenv from "dotenv"
import { log_balances } from "../Starknet/MySwap/log/logBalances"
import { Wallet, JsonRpcProvider, ethers } from "ethers"


dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = MySwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet
        const evm_provider = new JsonRpcProvider( "https://arb-mainnet.g.alchemy.com/v2/nF1xyda-OPe-KI9_fQG6FvO6i9u5aMEF" )

        const starkSigner = new Account( TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )
        const evmSigner = new Wallet( process.env.ETH_PRIVATE_KEY!, evm_provider)

        console.log("stark account: ", starkSigner.address)
        console.log("evm account: ", evmSigner.address)
        console.log("Arbitrum eth balance: ", ethers.formatEther( await evm_provider.getBalance( evmSigner.address ) ))
        await log_balances( starkSigner, network )

        // await MySwap.swap(
        //     starkSigner,
        //     [ TOKENS[ network ].eth, TOKENS[ network ].usdc ],
        //     "0.004008633826244499",
        //     network
        // )

        // await MySwap.addLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].usdc,
        //     null,
        //     TOKENS[ network ].eth,
        //     null,
        //     true,
        //     network
        // )

        // await MySwap.removeLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].usdc,
        //     TOKENS[ network ].eth,
        //     100,
        //     network      
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()