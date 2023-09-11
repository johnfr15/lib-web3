import { Account } from "starknet"
import MySwap from "../MySwap"
import dotenv from "dotenv"


dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = MySwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const starkSigner = new Account( TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )

        console.log("stark account: ", starkSigner.address)
        console.log("")


        // await MySwap.swap(
        //     starkSigner,
        //     [ TOKENS[ network ].dai, TOKENS[ network ].eth ],
        //     "0.001",
        //     network
        // )

        // MySwap.addLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].dai,
        //     "0.01",
        //     TOKENS[ network ].eth,
        //     null,
        //     false,
        //     network
        // )

        // MySwap.withdrawLiquidity( 
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