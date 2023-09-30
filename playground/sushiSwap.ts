import { JsonRpcProvider, Wallet } from "ethers"
import SushiSwap from "../Polygon/SushiSwap"
import { log_balances } from "../Polygon/Uniswap/log"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { POLYGON_PROVIDER, TOKENS } = SushiSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet
        const provider = POLYGON_PROVIDER[ network ]

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, new JsonRpcProvider( provider ) )

        console.log("account: ", signer.address)
        await log_balances( signer, network )
        console.log("")

        
        await SushiSwap.swap(
            signer,
            [ TOKENS[ network ].matic, TOKENS[ network ].usdc ],
            "0.2",
            null,
            network,
        )

        // await SushiSwap.addLiquidity( 
        //     signer,
        //     TOKENS[ network ].matic,
        //     "5.935134845225700674",
        //     TOKENS[ network ].weth,
        //     null,
        //     false,
        //     network
        // )

        // await SushiSwap.withdrawLiquidity( 
        //     signer,
        //     TOKENS[ network ].matic,
        //     TOKENS[ network ].weth,
        //     100,
        //     network
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()