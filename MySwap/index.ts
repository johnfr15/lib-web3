import { Account, Contract } from "starknet"
import * as MySwap from "./mySwap"
import * as Constant from "./constant"
import * as Utils from "./utils"

/*
  |***********************************|
  |          MySwap INTERFACE         |
  |___________________________________| 

  EVENT
  -  Upgraded()
  -  AdminChanged();

  READ
  -  get_version(pool_id: felt, lp_address: felt) view return(ver: felt)
  -  get_pool(pool_id: felt) view return(pool: Pool)
  -  get_lp_balance(pool_id: felt, lp_address: felt) view return(shares: Uint256)
  -  get_total_shares(pool_id: felt) view return(total_shares: Uint256)
  -  get_total_number_of_pools() view return(num: felt)
  
  WRITE
  -  swap(pool_id: felt, token_from_addr: felt, amount_from: Uint256, amount_to_min: Uint256) return(amount_to: Uint256)
  -  add_liquidity(a_address: felt, a_amount: Uint256, a_min_amount: Uint256, b_address: felt, b_amount: Uint256, b_min_amount: Uint256) return(actual1: Uint256, actual2: Uint256)
  -  withdraw_liquidity(pool_id: felt, shares_amount: Uint256, amount_min_a: Uint256, amount_min_b: Uint256) return(actual1: Uint256, actual2: Uint256, res1: Uint256, res2: Uint256,)
  -  get_new_pool_reserves(pool_id: felt) return(tokena_reserves: Uint256, tokenb_reserves: Uint256)
  !  create_new_pool(pool_name: felt, a_address: felt, a_initial_liquidity: Uint256, b_address: felt, b_initial_liquidity: Uint256, a_times_b_sqrt_value: Uint256) return(pool_id: felt)
  !  upgrade(new_implementation: felt) return()
*/


const main = async() => {
  const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS
  const PRIVATE_KEY = process.env.PRIVATE_KEY
  const { TESTNET_PROVIDER, TOKEN, TICKER } = Constant
  const network = "testnet" // testnet | mainnet

  try {
      // connect the contract
      const signer = new Account(TESTNET_PROVIDER, ACCOUNT_ADDRESS!, PRIVATE_KEY!);
      const { balance } = await Utils.get_balance(signer.address, signer, TOKEN.eth[network])
      console.log("Account: ", signer.address)
      console.log("Balance: ", balance, TICKER[TOKEN.eth[network]])

      // Swap
      await MySwap.swap( signer, [TOKEN.eth[network], TOKEN.usdc[network]], 0.000001 ) 

      // Add liquidity
      // await MySwap.add_liquidity(
      //     signer, 
      //     TOKEN.eth[network],
      //     0.00001, 
      //     TOKEN.dai[network],
      //     null,
      // )


  } catch (error: any) {

      console.log(error)
      return (1)

  }
}

main()