import { JsonRpcProvider, Wallet } from "ethers"
import PancakeSwapV2 from "../Arbitrum/PancakeSwapV2"
import { log_balances } from "../Arbitrum/PancakeSwapV2/log"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { ARBITRUM_PROVIDER, TOKENS } = PancakeSwapV2.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "MAINNET" // Testnet | Mainnet
        const provider = ARBITRUM_PROVIDER[ network ]

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, new JsonRpcProvider( provider ) )

        console.log("account: ", signer.address)
        await log_balances( signer, network )
        console.log("")

        
        await PancakeSwapV2.swap(
            signer,
            [ TOKENS[ network ].eth, TOKENS[ network ].usdc ],
            "0.2",
            null,
            network,
            100,
            100,
        )

        // await PancakeSwapV2.addLiquidity( 
        //     signer,
        //     TOKENS[ network ].matic,
        //     "5.935134845225700674",
        //     TOKENS[ network ].weth,
        //     null,
        //     false,
        //     network
        // )

        // await PancakeSwapV2.withdrawLiquidity( 
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