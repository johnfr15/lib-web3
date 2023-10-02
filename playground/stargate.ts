import { JsonRpcProvider, Wallet } from "ethers"
import Stargate from "../Bridge/Stargate"
import { log_balances } from "../Bridge/Stargate/log"
import dotenv from "dotenv"
import { Chains } from "../Bridge/Stargate/types"

dotenv.config()


const main = async() => {
    
    const { POLYGON_PROVIDER, TOKENS } = Stargate.Constant
    
    try {
        // Set up
        const fromChain: Chains = "polygonTestnet"
        const toChain: Chains = "avalancheTestnet"
        const provider = POLYGON_PROVIDER[ 'TESTNET' ]

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, new JsonRpcProvider( provider ) )

        console.log("account: ", signer.address)
        await log_balances( signer, fromChain )
        console.log("")

        
        await Stargate.bridge(
            signer,
            TOKENS[ fromChain ].usdt,
            TOKENS[ toChain ].usdt,
            fromChain,
            toChain,
            '1',
            // { max: true }
        )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()