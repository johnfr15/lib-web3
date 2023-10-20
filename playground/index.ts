import dotenv from "dotenv"
import { AddressLike, ethers, Wallet } from "ethers"
import { Account } from "starknet"
import Mute from "../ZkSync/Mute"
import l0kswap from "../Starknet/10kSwap"
import Orbiter from "../Bridge/Orbiter"
import Stargate from "../Bridge/Stargate"
import { resolve_chain } from "../Bridge/Bungee/utils"
import { Chains } from "../Bridge/Bungee/type/types"

dotenv.config()






const main = async() => {

    let evmsigner = new Wallet( process.env.TEST_ETH_PRIVATE_KEY!, ethers.getDefaultProvider("mainnet") )
    const starkSigner = new Account( Orbiter.Constant.MAINNET_PROVIDER, process.env.TEST_STARK_PUBLIC_KEY!, process.env.TEST_STARK_PRIVATE_KEY! )

    

    try {


        
    } catch ( error ) {
        
        throw( error )

    }
    

}


// const listen_token = async(signer: Wallet, tokenAddress: AddressLike, chain: Chains) => {

//     signer = resolve_chain( signer, chain )
//     const tokenABI = ['event Transfer(address indexed from, address indexed to, uint256 value)', 'function decimals()'];

//     const tokenContract = new ethers.Contract( tokenAddress as string, tokenABI, signer );
//     const decimals: number = await tokenContract.decimals()

//     console.log(`Listening on ${ chain } for token: ${ tokenAddress }...`)
//     await tokenContract.once('Transfer', (from, to, value, event) => {

//         if ( to === signer.address ) {
//           console.log(`Received ${ ethers.formatUnits( value, decimals ) } from ${from} !`);
//           // Trigger your custom function here
//         }
//     });
// }

const listen_starknet_token = async( signer: Account, tokenAddress: string ) => {

    const provider = Orbiter.Constant.MAINNET_PROVIDER
    let continuation_token = undefined
    let currBlock = 0

    while (true) 
    {
        const block = await provider.getBlock()

        const events: any = await provider.getEvents({
            from_block: "latest" as any,
            to_block: "latest" as any,
            chunk_size: 10,
        })


        if ( events.continuation_token !== continuation_token)
        {
            for( let event of events.events )
            {
                if ( event.fromAddress === tokenAddress.toLowerCase() )
                    console.log( event )
            }
        }

    
    }
}


main()
