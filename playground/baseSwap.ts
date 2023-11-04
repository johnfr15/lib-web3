import dotenv from "dotenv"
import { Wallet } from "ethers"
import BaseSwap from "../Base/BaseSwap"
import { CHAIN_ID } from "../Base/BaseSwap/config/constants"

dotenv.config()


const main = async() => {
    
    const { TOKENS } = BaseSwap.Constant
    const { resolve_provider, log_balances } = BaseSwap.Utils

    
    try {
        // Set up
        const provider = resolve_provider( CHAIN_ID[ "base" ] )

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, provider )

        console.log("account: ", signer.address)
        await log_balances( signer )
        console.log("")

        console.log("BaseSwap")
        
        await BaseSwap.swap(
            signer,
            [ TOKENS.eth, TOKENS.usdc ],
            "0.0001",
        )

        // await BaseSwap.addLiquidity( 
        //     signer,
        //     TOKENS.eth,
        //     "0.001",
        //     TOKENS.usdc,
        //     null,
        //     // { max: true }
        // )

        await BaseSwap.withdrawLiquidity( 
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