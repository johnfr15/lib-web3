import Bungee from "../Bridge/Bungee"
import { Wallet } from "ethers"
import { Chains } from "../Bridge/Bungee/type/types"
import { NATIVE_TOKEN } from "../Bridge/Bungee/config/constants"

const main = async() => {

    const { TOKENS, CHAIN_ID } = Bungee.Constant
    const { resolve_provider } = Bungee.Utils
    const { log_balances } = Bungee.Log
    
    try {

        // Set up
        const fromChain: Chains = "polygon" 
        const toChain: Chains = "arbitrum" 
        const provider = resolve_provider( CHAIN_ID[ fromChain ] )
        const signer = new Wallet( process.env.TEST_ETH_PRIVATE_KEY!, provider )

    
        console.log("account: ", signer.address)
        await log_balances( signer, fromChain )
        console.log("")
        

        await Bungee.bridge(
            signer,
            TOKENS[ fromChain ].usdc,
            NATIVE_TOKEN,
            fromChain,
            toChain,
            "1000",
            // { max: true }
        )
        
    } catch ( error: any ) {

        console.log( error )    

    }
}
  
main()

