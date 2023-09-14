import { Account } from "starknet"
import MySwap from "../Starknet/MySwap"
import dotenv from "dotenv"
import { log_balances } from "../Starknet/MySwap/log/logBalances"


dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = MySwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const starkSigner = new Account( TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )

        console.log("stark account: ", starkSigner.address)
        await log_balances( starkSigner, network )

        // await MySwap.swap(
        //     starkSigner,
        //     [ TOKENS[ network ].eth, TOKENS[ network ].usdc ],
        //     "0.003788862358341964",
        //     network
        // )

        // await MySwap.addLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].usdc,
        //     null,
        //     TOKENS[ network ].eth,
        //     '0.001920459998875498',
        //     false,
        //     network
        // )

        // await MySwap.withdrawLiquidity( 
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