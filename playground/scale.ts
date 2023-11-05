import dotenv from "dotenv"
import { Wallet } from "ethers"
import Scale from "../Base/Scale"
import { CHAIN_ID } from "../Base/Scale/config/constants"

dotenv.config()


const main = async() => {
    
    const { TOKENS } = Scale.Constant
    const { resolve_provider, log_balances } = Scale.Utils

    
    try {
        // Set up
        const provider = resolve_provider( CHAIN_ID[ "base" ] )

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, provider )

        console.log("account: ", signer.address)
        await log_balances( signer )
        console.log("")

        console.log("Scale")
        
        await Scale.swap(
            signer,
            [ TOKENS.eth, TOKENS.usdc ],
            "0.000001",
        )

        // await Scale.addLiquidity( 
        //     signer,
        //     TOKENS.eth,
        //     "0.001",
        //     TOKENS.usdc,
        //     null,
        //     // { max: true }
        // )

        await Scale.withdrawLiquidity( 
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