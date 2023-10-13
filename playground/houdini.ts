import { Wallet } from "ethers"
import Houdini from "../Houdini"
import dotenv from "dotenv"
import { Network } from "../Houdini/types"


dotenv.config()


const main = async() => {

    const { TOKENS } = Houdini.Constant
    const { resolve_provider  } = Houdini.Utils
    
    try {
        // Set up
        const fromNetwork: Network = "Arbitrum"
        const toNetwork: Network = "Ethereum Mainnet"
        const provider = resolve_provider( fromNetwork )

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, provider )

        await Houdini.swap( 
            signer, 
            "1",
            "ETHARB",
            "ETH",
            fromNetwork,
            toNetwork,
            { anonymous: true }
        )
        
    } catch ( error: any ) {

        throw( error )    

    }
}
  
main()