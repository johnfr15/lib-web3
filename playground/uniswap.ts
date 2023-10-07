import { Wallet } from "ethers"
import UniswapV3 from "../AMM/UniswapV3"
import { Chains } from "../AMM/UniswapV3/types"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TOKENS, CHAIN_ID } = UniswapV3.Constant
    const { resolve_provider  } = UniswapV3.Utils
    const { log_balances } = UniswapV3.Log
    
    try {
        // Set up
        const chain: Chains = "polygonTestnet"
        const provider = resolve_provider( CHAIN_ID[ chain ] )

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, provider )

        console.log("account: ", signer.address)
        await log_balances( signer, chain )
        console.log("")

        
        await UniswapV3.swap(
            signer,
            [ TOKENS[ chain ].matic, TOKENS[ chain ].usdc ],
            '0.001',
            null,
            chain
        )

        await UniswapV3.addLiquidity( 
            signer,
            TOKENS[ chain ].matic,
            null,
            TOKENS[ chain ].usdc,
            '0.00001',
            chain
        )

        // await UniswapV3.withdrawLiquidity( 
        //     signer,
        //     TOKENS[ chain ].eth,
        //     TOKENS[ chain ].usdc,
        //     chain
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()