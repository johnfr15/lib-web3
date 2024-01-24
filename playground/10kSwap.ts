import { Account } from "starknet"
import l0kSwap from "../libWeb3/AMM/Starknet/10kSwap"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = l0kSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const starkSigner = new Account( TESTNET_PROVIDER, process.env.STARKNET_PUBLIC_KEY!, process.env.STARKNET_PRIVATE_KEY! )

        console.log("stark account: ", starkSigner.address)


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