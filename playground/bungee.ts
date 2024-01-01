import Bungee from "../libWeb3/Bridge/Bungee"
import { Wallet } from "ethers"
import { Chains } from "../libWeb3/Bridge/Bungee/types/types"

const main = async() => {

    const { TOKENS, CHAIN_ID, NATIVE_TOKEN } = Bungee.Constant
    const { resolve_provider, log_balances } = Bungee.Utils
    
    try {

        // Set up
        const fromChain: Chains = "arbitrum" 
        const toChain: Chains = "polygon" 
        const provider = resolve_provider( CHAIN_ID[ fromChain ] )
        const signer = new Wallet( process.env.TEST_ETH_PRIVATE_KEY!, provider )

    
        console.log( "account: ", signer.address )
        await log_balances( signer, fromChain )
        console.log("")
        

        await Bungee.bridge(
            signer,
            NATIVE_TOKEN,
            TOKENS[ toChain ].usdc,
            fromChain,
            toChain,
            "0.01",
        )
        
    } catch ( error: any ) {

        console.log( error )    

    }
}
  
main()

