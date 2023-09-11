import { Account } from "starknet"
import jediSwap from "../jediSwap"
import dotenv from "dotenv"
import { StarknetChainId, Token } from "l0k_swap-sdk"
import { get_pool, sort_tokens } from "../jediSwap/utils"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = jediSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const starkSigner = new Account( TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )

        console.log("stark account: ", starkSigner.address)
        console.log("")



        // await jediSwap.swap(
        //     starkSigner,
        //     [ TOKENS[ network ].eth, TOKENS[ network ].dai ],
        //     "0.0000001",
        //     null,
        // )

        // jediSwap.addLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     null,
        //     TOKENS[ network ].dai,
        //     "0.01",
        // )

        // jediSwap.withdrawLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     TOKENS[ network ].dai,
        //     100
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()