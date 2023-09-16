import { Account } from "starknet"
import JediSwap from "../Starknet/JediSwap"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = JediSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const starkSigner = new Account( TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )

        console.log("stark account: ", starkSigner.address)
        await JediSwap.Log.log_balances( starkSigner, network )



        // await JediSwap.swap(
        //     starkSigner,
        //     [ TOKENS[ network ].usdc, TOKENS[ network ].eth ],
        //     null,
        //     "0.002069563663278504",
        //     network
        // )

        // JediSwap.addLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     null,
        //     TOKENS[ network ].dai,
        //     "0.01",
        //     false,
        //     network
        // )

        // JediSwap.withdrawLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     TOKENS[ network ].dai,
        //     100,
        //     network
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()