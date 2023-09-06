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


        await MySwap.swap(
            starkSigner,
            [ TOKENS[ network ].eth, TOKENS[ network ].eth ],
            "0.0000001",
        )

        // MySwap.addLiquidity( 
        //     starkSigner,
        //     TOKEN[ network ].dai,
        //     null,
        //     TOKEN[ network ].eth,
        //     null,
        //     1
        // )

        // MySwap.withdrawLiquidity( 
        //     starkSigner,
        //     TOKEN[ network ].eth,
        //     TOKEN[ network ].dai,       
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()