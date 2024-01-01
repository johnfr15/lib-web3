import { Wallet } from "ethers"
import Stargate from "../libWeb3/Bridge/Stargate"
import { Chains } from "../libWeb3/Bridge/Stargate/types"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { STARGATE_CHAIN_ID, TOKENS } = Stargate.Constant
    const { resolve_provider } = Stargate.Utils
    
    try {
        // Set up
        const fromChain: Chains = "polygon"
        const toChain: Chains = "arbitrum"

        const provider = resolve_provider( STARGATE_CHAIN_ID[ fromChain ] )
        const signer = new Wallet( process.env.TEST_ETH_PRIVATE_KEY!, provider )

        console.log("account: ", signer.address)
        console.log("")

        
        await Stargate.bridge(
            signer,
            TOKENS[ fromChain ].usdc,
            TOKENS[ toChain ].usdc,
            fromChain,
            toChain,
            null,
            { max: true }
        )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()
