import { Account } from "starknet"
import l0kSwap from "../Starknet/10kSwap"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = l0kSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const starkSigner = new Account( TESTNET_PROVIDER, "0x58626fc877885de4d8a12abcca0eaa036e26ea969a16dc73a5aca5c264c4fba", "0xaaf79db8975ea77d8f231c5463b7ec134d906aaad154cf886bde55687a6f58" )

        console.log("stark account: ", starkSigner.address)
        await l0kSwap.Log.log_balances( starkSigner, network )


        await l0kSwap.swap(
            starkSigner,
            [ TOKENS[ network ].eth, TOKENS[ network ].usdc ],
            "0.00005",
            null,
            network
        )

        // await l0kSwap.addLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     null,
        //     TOKENS[ network ].usdc,
        //     null,
        //     true,
        //     network
        // )

        // await l0kSwap.removeLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     TOKENS[ network ].usdc,
        //     100,
        //     network      
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()