import { Account } from "starknet"
import l0kSwap from "../10kSwap"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = l0kSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet
        const provider = network === 'TESTNET' ? TESTNET_PROVIDER : MAINNET_PROVIDER

        const starkSigner = new Account( provider,  process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )

        console.log("stark account: ", starkSigner.address)
        console.log("")


        // await l0kSwap.swap(
        //     starkSigner,
        //     [ TOKENS[ network ].dai, TOKENS[ network ].eth ],
        //     "0.01",
        //     null,
        //     network
        // )

        // l0kSwap.addLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     null,
        //     TOKENS[ network ].dai,
        //     "0.01",
        //     false,
        //     network
        // )

        // l0kSwap.withdrawLiquidity( 
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