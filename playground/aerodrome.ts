import dotenv from "dotenv"
import { Wallet } from "ethers"
import Aerodrome from "../libWeb3/AMM/Base/Aerodrome"

dotenv.config()


const main = async() => {
    
    const { TOKENS, CHAIN_ID } = Aerodrome.Constant
    const { resolve_provider, log_balances } = Aerodrome.Utils

    
    try {
        // Set up
        const provider = resolve_provider( CHAIN_ID[ "base" ] )

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, provider )

        console.log("account: ", signer.address)
        await log_balances( signer )
        console.log("")

        console.log("AERODROME")
        
        // await Aerodrome.swap(
        //     signer,
        //     [ TOKENS.eth, TOKENS.usdc ],
        //     "0.000001",
        // )

        // await Aerodrome.addLiquidity( 
        //     signer,
        //     TOKENS.eth,
        //     "0.001",
        //     TOKENS.usdc,
        //     null,
        //     // { max: true }
        // )

        await Aerodrome.removeLiquidity( 
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