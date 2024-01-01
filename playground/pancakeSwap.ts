import { Wallet } from "ethers"
import dotenv from "dotenv"
import PancakeSwapV3 from "../libWeb3/MCAMM/PancakeswapV3"
import { Chains } from "../libWeb3/MCAMM/PancakeswapV3/types"

dotenv.config()


const main = async() => {
    
    const { TOKENS, CHAIN_ID } = PancakeSwapV3.Constant
    const { resolve_provider } = PancakeSwapV3.Utils

    
    try {

        // Set up
        const chain: Chains = "bsc" // Testnet | Mainnet
        const provider = resolve_provider( CHAIN_ID[ chain ] )

        const signer = new Wallet( process.env.TEST_ETH_PRIVATE_KEY!, provider )

        console.log("account: ", signer.address)
        console.log("")

        console.log("PANCAKESWAP")

        // await PancakeSwapV3.swap(
        //     signer,
        //     [ TOKENS[ chain ].eth, TOKENS[ chain ].usdc ],
        //     "0.0000001",
        //     null,
        //     chain
        // )

        await PancakeSwapV3.addLiquidity( 
            signer,
            TOKENS[ chain ].usdc,
            null,
            TOKENS[ chain ].dai,
            null,
            chain,
            { max: true }
        )

        // await PancakeSwapV3.removeLiquidity( 
        //     signer,
        //     TOKENS[ chain ].eth,
        //     TOKENS[ chain ].usdc,
        //     chain,
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()

