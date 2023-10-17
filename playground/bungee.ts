import { Wallet } from "ethers"
import { get_all_token } from "../Bridge/Bungee/api/TokenLists/all"
import { get_from_token_list } from "../Bridge/Bungee/api/TokenLists/from-token-list"
import { get_chain_token } from "../Bridge/Bungee/api/TokenLists/chain"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {

    
    try {
        // Set up


        console.log( await get_from_token_list( 10 ) )
        
    } catch ( error: any ) {

        throw( error )    

    }
}
  
main()