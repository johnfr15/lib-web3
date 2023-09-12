import { Account } from "starknet"
import MySwap from "../Starknet/MySwap"
import dotenv from "dotenv"

dotenv.config()

const main = async() => {
    
    const { TESTNET_PROVIDER, TOKEN, TICKER } = MySwap.Constant
    const network = "testnet" // testnet | mainnet
  
    try {
        // Set up
        const signer = new Account(TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY!);
        const { balance } = await MySwap.Utils.get_balance(signer.address, signer, TOKEN.eth[network])
        console.log("Account: ", signer.address)
        console.log("Balance: ", balance, TICKER[TOKEN.eth[network]])
  
        console.log("\n\n")

        console.log("##### Test 1 ###########################################")
        console.log("Swap minimum amount of ETH to DAI")
        await test1(signer, network)
        console.log("########################################################")
        
        console.log("\n\n")
        
        console.log("##### Test 2 ###########################################")
        console.log("Swap 10000 ETH to DAI => Error 'Unsufficient balance'")
        await test2(signer, network)
        console.log("########################################################")
        
        console.log("\n\n")
        
        console.log("##### Test 3 ###########################################")
        console.log("Swap DAI to wstETH => Error pool does not exist")
        await test3(signer, network)
        console.log("########################################################")
        
        console.log("\n\n")
        
        console.log("##### Test 4 ###########################################")
        console.log("Add max liquidity of token ETH / USDC and withdraw all")
        await test4(signer, network)
        console.log("########################################################")
        
        console.log("\n\n")
        
        console.log("##### Test 5 ###########################################")
        console.log("Add minimum liquidity of token ETH / DAI and withdraw all")
        await test5(signer, network)
        console.log("########################################################")
        
        console.log("\n\n")
        
        console.log("##### Test 6 ###########################################")
        console.log("Add liquidity of token2 (ETH / USDC) and withdraw half")
        await test6(signer, network)
        console.log("########################################################")
        
        console.log("\n\n")
        
        console.log("##### Test 7 ###########################################")
        console.log("Add liquidity to unknown pool: Error 'Pool does not exist'")
        await test7(signer, network)
        console.log("########################################################")

        console.log("\n\n")

  
    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}

const test1 = async(signer: Account, network: string) => {
    const { TOKEN } = MySwap.Constant
    
    try {
        await MySwap.swap( signer, [TOKEN.eth[network], TOKEN.dai[network]], "0.000000000000000001" )
    } catch (error) {
        console.log(error)
    }
}

const test2 = async(signer: Account, network: string) => {
    const { TOKEN } = MySwap.Constant

    try {
        await MySwap.swap( signer, [TOKEN.eth[network], TOKEN.dai[network]], "100" ) 
    } catch (error) {
        console.log(error)
    }

}
const test3 = async(signer: Account, network: string) => {
    const { TOKEN } = MySwap.Constant

    try {
        await MySwap.swap( signer, [TOKEN.dai[network], TOKEN.wsteth[network]], "0.000001" ) 
    } catch (error) {
        console.log(error)
    }

}
const test4 = async(signer: Account, network: string) => {
    const { TOKEN } = MySwap.Constant

    try {
        await MySwap.add_liquidity(
            signer, 
            TOKEN.eth[network],
            null, 
            TOKEN.usdc[network],
            null,
            1
        )
        await MySwap.withdraw_liquidity(signer, TOKEN.usdc[network], TOKEN.eth[network]) 
    } catch (error) {
        console.log(error)
    }

}
const test5 = async(signer: Account, network: string) => {
    const { TOKEN } = MySwap.Constant

    try {
        await MySwap.add_liquidity(
            signer, 
            TOKEN.eth[network],
            "0.00000000000000001", 
            TOKEN.dai[network],
            null,
        )
        await MySwap.withdraw_liquidity(signer, TOKEN.dai[network], TOKEN.eth[network]) 
    } catch (error) {
        console.log(error)
    }

}
const test6 = async(signer: Account, network: string) => {
    const { TOKEN } = MySwap.Constant

    try {
        await MySwap.add_liquidity(
            signer, 
            TOKEN.eth[network],
            null,
            TOKEN.usdc[network],
            "34", 
        )
        await MySwap.withdraw_liquidity(signer, TOKEN.usdc[network], TOKEN.eth[network], 50)
        console.log("\n\nClearing pool")
        await MySwap.withdraw_liquidity(signer, TOKEN.usdc[network], TOKEN.eth[network]) 
    } catch (error) {
        console.log(error)
    }

}
const test7 = async(signer: Account, network: string) => {
    const { TOKEN } = MySwap.Constant

    try {
        await MySwap.add_liquidity(
            signer, 
            TOKEN.wsteth[network],
            null,
            TOKEN.dai[network],
            null,
            1 
        ) 
    } catch (error) {
        console.log(error)
    }

}
const test8 = async(signer: Account, network: string) => {
    const { TOKEN } = MySwap.Constant

    try {
        await MySwap.swap( signer, [TOKEN.eth[network], TOKEN.dai[network]], "100" ) 
    } catch (error) {
        console.log(error)
    }

}
const test9 = async(signer: Account, network: string) => {
    const { TOKEN } = MySwap.Constant

    try {
        await MySwap.swap( signer, [TOKEN.eth[network], TOKEN.dai[network]], "100" ) 
    } catch (error) {
        console.log(error)
    }
}


  
  main()