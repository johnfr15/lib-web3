import { Account } from "starknet"
import JediSwap from "../libWeb3/AMM/Starknet/JediSwap"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = JediSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const starkSigner = new Account( TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )

        console.log("stark account: ", starkSigner.address)



        // await JediSwap.swap(
        //     starkSigner,
        //     [ TOKENS[ network ].usdc, TOKENS[ network ].eth ],
        //     null,
        //     "0.002069563663278504",
        //     network
        // )

        // await JediSwap.addLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     null,
        //     TOKENS[ network ].usdc,
        //     null,
        //     true,
        //     network
        // )

        // await JediSwap.removeLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     TOKENS[ network ].usdc,
        //     100,
        //     network
        // )

    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()