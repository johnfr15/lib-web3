import { Account } from "starknet"
import l0kSwap from "../Starknet/10kSwap"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = l0kSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const starkSigner = new Account( TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )

        console.log("stark account: ", starkSigner.address)
        await l0kSwap.Log.log_balances( starkSigner, network )


        // await l0kSwap.swap(
        //     starkSigner,
        //     [ TOKENS[ network ].eth, TOKENS[ network ].usdc ],
        //     "0.004312009164397568",
        //     null,
        //     network
        // )

        await l0kSwap.addLiquidity( 
            starkSigner,
            TOKENS[ network ].eth,
            null,
            TOKENS[ network ].usdc,
            null,
            true,
            network
        )

        await l0kSwap.withdrawLiquidity( 
            starkSigner,
            TOKENS[ network ].eth,
            TOKENS[ network ].usdc,
            100,
            network      
        )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()