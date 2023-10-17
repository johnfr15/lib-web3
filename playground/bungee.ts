import { Wallet } from "ethers"
import { get_all_token } from "../Bridge/Bungee/api/TokenLists/all"
import { get_from_token_list } from "../Bridge/Bungee/api/TokenLists/from-token-list"
import { get_chain_token } from "../Bridge/Bungee/api/TokenLists/chain"
import { get_gas_price } from "../Bridge/Bungee/api/App/gas-price"
import { get_token_price } from "../Bridge/Bungee/api/App/token-price"
import dotenv from "dotenv"
import { TOKENS } from "../Bridge/Bungee/config/constants"


const main = async() => {

    
    try {
        // Set up


        console.log( await get_token_price( TOKENS.ethereum.usdc, 1 ) )
        // console.log( await get_gas_price( 10 ) )
        
    } catch ( error: any ) {

        throw( error )    

    }
}
  
main()