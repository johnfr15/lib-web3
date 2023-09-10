import { Account } from "starknet"
import l0kSwap from "../10kSwap"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = l0kSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "MAINNET" // Testnet | Mainnet

        const starkSigner = new Account( MAINNET_PROVIDER, process.env.TEST_STARK_PUBLIC_KEY!, process.env.TEST_STARK_PRIVATE_KEY! )

        console.log("stark account: ", starkSigner.address)
        console.log("")


        // await l0kSwap.swap(
        //     starkSigner,
        //     [ TOKENS[ network ].usdc, TOKENS[ network ].eth ],
        //     "6.519125",
        //     null,
        //     network
        // )

        // l0kSwap.addLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     '0.000008571428571428',
        //     TOKENS[ network ].dai,
        //     null,
        // )

        // l0kSwap.withdrawLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     TOKENS[ network ].dai,       
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()