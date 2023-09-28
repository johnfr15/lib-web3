import { Wallet } from "ethers"
import Uniswap from "../Polygon/Uniswap"
import { log_balances } from "../Polygon/Uniswap/log"
import dotenv from "dotenv"
import { MAINNET_PROVIDER } from "../Polygon/Uniswap/config/constants"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, ZERO_ADDRESS, TOKENS } = Uniswap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet
        const provider = network === 'TESTNET' ? TESTNET_PROVIDER : MAINNET_PROVIDER

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, provider )

        console.log("account: ", signer.address)
        await log_balances( signer, network )
        console.log("")

        
        await Uniswap.swap(
            signer,
            [ TOKENS[ network ].matic, TOKENS[ network ].dai ],
            "1",
            network
        )

        // await Uniswap.addLiquidity( 
        //     signer,
        //     TOKENS[ network ].eth,
        //     null,
        //     TOKENS[ network ].dai,
        //     null,
        //     true,
        //     network
        // )

        // await Uniswap.withdrawLiquidity( 
        //     signer,
        //     TOKENS[ network ].eth,
        //     TOKENS[ network ].dai,
        //     100,
        //     network
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()