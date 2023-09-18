import { ethers, Wallet, HDNodeWallet } from "ethers";
import * as bip39 from "bip39"
import fs from "fs";
import { Account, ec, hash, Provider, uint256, Contract } from "starknet";
import { ERC20_ABI, MAINNET_PROVIDER, TESTNET_PROVIDER, TOKENS } from "./constants";

const FILE_PATH = "./Starknet/StarknetWallet/accounts.json"

/**
 * @name pre_compute
 * @param classHash   // Needed to know our future account address. It can be a OZ / Argent type of account
 * @returns           // Return the id of the account stored in out accounts.json file
 */
export const pre_compute = async( classHash: string ): Promise<number> => {
    let accounts: { [key: string | number]: any } = {}
    
    try {

        accounts = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        
    } catch (error) {
        
    }

    const seed = bip39.generateMnemonic(128);
    

    const path = "m/44'/9004'/0'/0/0"
    const childNode = HDNodeWallet.fromPhrase( seed, undefined, path )

    const starkKeyPair = ec.starkCurve.grindKey( childNode.privateKey  ) 
    const starkKeyPub = ec.starkCurve.getStarkKey( starkKeyPair )

    const precalculatedAddress = hash.calculateContractAddressFromHash(
        starkKeyPub, // salt
        classHash,
        [ "0x33434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2", '0x79dc0da7c54b95f10aa182ad0a46400db63156920adb65eca2654c0945a463', [ starkKeyPub, "0x0"] ],
        0
    );

    console.log( "Contract address ", precalculatedAddress )

    const id = Object.keys( accounts ).length
    const timestamp = Date.now();
    const date = new Date(timestamp);

    accounts[ id ] = {
        generation: date.toLocaleString(),
        classHash: classHash,
        seed: seed,
        privateKey: "0x" + starkKeyPair,
        starkKeyPub: starkKeyPub,
        accountAddress: precalculatedAddress,
        node: childNode
    }
    
    try {
        
        const data = JSON.stringify( accounts, null, 2 )
        await fs.writeFileSync(FILE_PATH, data, { encoding: 'utf-8', flag: 'w' });

    } catch ( error ) {

        throw( error )

    }

    return id
}

/**
 * @name deploy_contract
 * @param id            - Id of the generated wallet in ./accounts.json
 * @param provider 
 */
export const deploy_contract = async( id: number, provider: Provider ) => {
    
    let accounts: { [key: string | number]: any } = {}

    try {

        accounts = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        let { classHash, accountAddress, privateKey, starkKeyPub } = accounts[ id ]

        const account = new Account( provider, starkKeyPub, privateKey );
    
        /*========================================= TX ================================================================================================*/
        console.log(`\nDeploying contract address: ${ accountAddress } ...`)
        const tx = await account.deployAccount({
            classHash: classHash,
            constructorCalldata: [ "0x33434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2", '0x79dc0da7c54b95f10aa182ad0a46400db63156920adb65eca2654c0945a463', [ starkKeyPub, "0x0"] ],
            contractAddress: accountAddress,
            addressSalt: starkKeyPub
        });
        await account.waitForTransaction( tx.transaction_hash );

        console.log( "\nContract account deployed !" )
        console.log("hash: ", tx.transaction_hash )
        /*=============================================================================================================================================*/

    } catch (error) {
        
        console.log( error )

    }
}

export const get_account = async( id: number, provider: Provider ): Promise<Account> => {

    let accounts: { [key: string | number]: any } = {}

    try {

        accounts = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        let { accountAddress, privateKey } = accounts[ id ]

        const account = new Account( provider, accountAddress, privateKey );

        return account
        
    } catch (error) {
        
       throw( error )

    }
}

export const fund = async( recipent: string, amountETH: string, signer: Account, network: 'TESTNET' | 'MAINNET' ) => {

    const Weth = new Contract( ERC20_ABI, TOKENS[ network ].eth, signer )

    try {

        const uint_amount = uint256.bnToUint256( ethers.parseEther( amountETH ) )

        console.log(`\nFunding ${ amountETH } to ${ recipent } ...`)

        const tx = await Weth.transfer( recipent, uint_amount )
        await signer.waitForTransaction( tx.transaction_hash )

        console.log("\nTransaction valided !")
        console.log("hash: ", tx.transaction_hash)

    } catch (error) {
        
        throw( error )
    }
}

export const deploy_wallet = async( signer: Account, classHash: string, network: 'TESTNET' | 'MAINNET', fundInit?: string ): Promise<string> => {

    const provider = network === 'TESTNET' ? TESTNET_PROVIDER : MAINNET_PROVIDER

    try {
        
        const id = await pre_compute( classHash )
        const new_account = await get_account( id, provider )

        await fund( new_account.address, fundInit ?? '0.00002', signer, network )

        await deploy_contract( id, provider )

        return new_account.address

    } catch (error) {
        
        throw( error )

    }
}