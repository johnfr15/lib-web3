import { JsonRpcProvider, Wallet } from "ethers"
import SushiSwap from "../Polygon/SushiSwap"
import { log_balances } from "../Polygon/Uniswap/log"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { POLYGON_PROVIDER, ZERO_ADDRESS, TOKENS } = SushiSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet
        const provider = POLYGON_PROVIDER[ network ]

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, new JsonRpcProvider( provider ) )

        console.log("account: ", signer.address)
        await log_balances( signer, network )
        console.log("")

        
        // await SushiSwap.swap(
        //     signer,
        //     [ TOKENS[ network ].matic, TOKENS[ network ].dai ],
        //     "0.0000000001",
        //     null,
        //     network
        // )

        await SushiSwap.addLiquidity( 
            signer,
            TOKENS[ network ].matic,
            null,
            TOKENS[ network ].dai,
            null,
            true,
            network
        )

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