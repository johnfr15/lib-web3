import dotenv from "dotenv"
import { Wallet } from "ethers"
import BaseSwapV3 from "../Base/BaseSwapV3"
import BaseSwapV2 from "../Base/BaseSwapV2"
import { CHAIN_ID } from "../Base/BaseSwapV3/config/constants"

dotenv.config()


const main = async() => {
    
    const { TOKENS } = BaseSwapV2.Constant
    const { resolve_provider, log_balances } = BaseSwapV2.Utils

    
    try {
        // Set up
        const provider = resolve_provider( CHAIN_ID[ "base" ] )

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, provider )

        console.log("account: ", signer.address)
        await log_balances( signer )
        console.log("")

        console.log("BaseSwapV2")
        
        // await BaseSwapV2.swap(
        //     signer,
        //     [ TOKENS.eth, TOKENS.usdc ],
        //     "0.01",
        // )

        // await BaseSwapV2.addLiquidity( 
        //     signer,
        //     TOKENS.eth,
        //     "0.001",
        //     TOKENS.usdc,
        //     null,
        //     { max: true }
        // )

        await BaseSwapV2.removeLiquidity( 
            signer,
            TOKENS.eth,
            TOKENS.usdc,
        )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()