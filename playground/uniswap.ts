import { Wallet } from "ethers"
import UniswapV3 from "../libWeb3/MCAMM/UniswapV3"
import { Chains } from "../libWeb3/MCAMM/UniswapV3/types"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TOKENS, CHAIN_ID } = UniswapV3.Constant
    const { resolve_provider, log_balances  } = UniswapV3.Utils
    
    try {
        // Set up
        const chain: Chains = "optimism"
        const provider = resolve_provider( CHAIN_ID[ chain ] )

        const signer = new Wallet( process.env.TEST_ETH_PRIVATE_KEY!, provider )


        console.log("account: ", signer.address)
        await log_balances( signer, chain )
        console.log("")

        console.log("UNISWAP")

        await UniswapV3.swap(
            signer,
            [ TOKENS[ chain ].eth, TOKENS[ chain ].usdc ],
            '0.001',
            null,
            chain
        )

        // await UniswapV3.addLiquidity( 
        //     signer,
        //     TOKENS[ chain ].eth,
        //     null,
        //     TOKENS[ chain ].usdt,
        //     null,
        //     chain,
        //     { max: true }
        // )

        // await UniswapV3.removeLiquidity( 
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