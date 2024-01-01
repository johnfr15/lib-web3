import { Wallet } from "ethers"
import SushiSwapV3 from "../libWeb3/MCAMM/SushiSwapV3"
import { Chains } from "../libWeb3/MCAMM/SushiSwapV3/types"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TOKENS, CHAIN_ID } = SushiSwapV3.Constant
    const { resolve_provider, log_balances } = SushiSwapV3.Utils

    
    try {
        // Set up
        const chain: Chains = "arbitrum" // Testnet | Mainnet
        const provider = resolve_provider( CHAIN_ID[ chain ] )

        const signer = new Wallet( process.env.TEST_ETH_PRIVATE_KEY!, provider )

    
        console.log("account: ", signer.address)
        await log_balances( signer, chain )
        console.log("")

        console.log("SUSHISWAP")
        
        // await SushiSwapV3.swap(
        //     signer,
        //     [ TOKENS[ chain ].eth, TOKENS[ chain ].usdc ],
        //     "0.000001",
        //     null,
        //     chain
        // )

        // await SushiSwapV3.addLiquidity( 
        //     signer,
        //     TOKENS[ chain ].eth,
        //     null,
        //     TOKENS[ chain ].usdt,
        //     null,
        //     chain,
        //     { max: true }
        // )

        // await SushiSwapV3.removeLiquidity( 
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



// Example of encoding a struct 

// const addr = ethers.Typed.address('0xd4e42e41FCa01464d36a44ACAb98D2aA1447e8f4')
// const str = ethers.Typed.string('Hello World')
// const obj = {
//     address: '0xd4e42e41FCa01464d36a44ACAb98D2aA1447e8f4',
//     message: ethers.toUtf8Bytes( 'Hello World' )
// }


// const encoded = ethers.AbiCoder.defaultAbiCoder().encode( [ "tuple(address,bytes)" ], [ Object.values( obj ) ]  )
// console.log( encoded )