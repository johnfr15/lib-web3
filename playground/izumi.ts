import { Wallet } from "ethers"
import Izumi from "../AMM/Izumi"
import { Chains } from "../AMM/Izumi/types"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TOKENS, CHAIN_ID } = Izumi.Constant
    const { resolve_provider, log_balances  } = Izumi.Utils
    
    try {
        // Set up
        const chain: Chains = "zksyncTestnet"
        const provider = resolve_provider( CHAIN_ID[ chain ] )

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, provider )


        console.log("account: ", signer.address)
        await log_balances( signer, chain )
        console.log("")

        console.log("IZUMI")

        await Izumi.swap(
            signer,
            [ TOKENS[ chain ].usdc, TOKENS[ chain ].eth ],
            '1',
            chain,
            { percent: 66 }
        )

        // await Izumi.addLiquidity( 
        //     signer,
        //     TOKENS[ chain ].eth,
        //     null,
        //     TOKENS[ chain ].usdt,
        //     null,
        //     chain,
        //     { max: true }
        // )

        // await Izumi.withdrawLiquidity( 
        //     signer,
        //     TOKENS[ chain ].eth,
        //     TOKENS[ chain ].usdc,
        //     chain,
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()