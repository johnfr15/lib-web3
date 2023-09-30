import { JsonRpcProvider, Wallet } from "ethers"
import SushiXCrossSwap from "../SushiXCrossSwap"
import { log_balances } from "../Polygon/Uniswap/log"
import dotenv from "dotenv"
import { Chains } from "../SushiXCrossSwap/types"

dotenv.config()


const main = async() => {
    
    const { POLYGON_PROVIDER, TOKENS } = SushiXCrossSwap.Constant
    
    try {
        // Set up
        const fromChain: Chains = "polygon"
        const toChain: Chains = "arbitrum"
        const provider = POLYGON_PROVIDER[ 'MAINNET' ]

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, new JsonRpcProvider( provider ) )

        console.log("account: ", signer.address)
        await log_balances( signer, 'MAINNET' )
        console.log("")

        
        await SushiXCrossSwap.bridge(
            signer,
            TOKENS[ toChain ].usdc,
            TOKENS[ fromChain ].usdc,
            toChain,
            fromChain,
            '0.001',
            { max: true }
        )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()