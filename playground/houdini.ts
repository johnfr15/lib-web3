import { Wallet } from "ethers"
import Houdini from "../Bridge/Houdini"
import dotenv from "dotenv"
import { Network } from "../Bridge/Houdini/types"


dotenv.config()


const main = async() => {

    const { TOKENS } = Houdini.Constant
    const { resolve_provider  } = Houdini.Utils
    
    try {
        // Set up
        const fromNetwork: Network = "BASE Base"
        const toNetwork: Network = "Ethereum Mainnet"
        const provider = resolve_provider( fromNetwork )

        const signer = new Wallet( process.env.TEST_ETH_PRIVATE_KEY!, provider )

        await Houdini.bridge( 
            signer, 
            "1",
            "ETHBASE",
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