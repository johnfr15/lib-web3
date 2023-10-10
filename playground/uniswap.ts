import { Wallet, ethers } from "ethers"
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
        const chain: Chains = "polygon"
        const provider = resolve_provider( CHAIN_ID[ chain ] )

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, provider )


        console.log("account: ", signer.address)
        await log_balances( signer, chain )
        console.log("")

        
        // await UniswapV3.swap(
        //     signer,
        //     [ TOKENS[ chain ].usdc, TOKENS[ chain ].dai ],
        //     '12',
        //     null,
        //     chain
        // )

        await UniswapV3.addLiquidity( 
            signer,
            TOKENS[ chain ].dai,
            "1",
            TOKENS[ chain ].matic,
            null,
            chain,
            // { max: true }
        )

        // await UniswapV3.withdrawLiquidity( 
        //     signer,
        //     TOKENS[ chain ].dai,
        //     TOKENS[ chain ].usdc,
        //     chain,
        //     { percent: 100 }
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()