import fs from "fs";
import { Account, Provider } from "starknet";
import { Account as AccountCreate } from "../type";
import { MAINNET_PROVIDER, TESTNET_PROVIDER } from "../Argent/constants";
import { deployBraavosAccount, pre_compute_braavos } from "./helpers"
import { gen_stark_key_pair, get_account, fund } from "../utils";

const FILE_PATH = __dirname + "/../accounts.json"

/**
 * @name declare_braavos
 * 
 * @notice Generate mnemonic and precompute the node's information and address of the 
 *         futur "Bravos account" and store it in "accounts.json" at the root of the 
 *         StarknetWallet module  
 * 
 * @return Id of the new account
 */
export const declare_braavos = async(): Promise<number> => {
    
    
    const { node, privateKey, publicKey } = gen_stark_key_pair()

    const bravos_account = pre_compute_braavos( publicKey, privateKey )

    try {

        const accounts = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )

        const id = Object.keys( accounts ).length
        accounts[ id ] = { ...bravos_account, node }

        const data = JSON.stringify( accounts, null, 2 )
        await fs.writeFileSync(FILE_PATH, data, { encoding: 'utf-8', flag: 'w' });

        return id

    } catch ( error ) {

        throw( error )

    }
}

/**
 * @notice This function deploy one "Braavos account" from already declared from accounts.json 
 *  
 * @param id        - Id of the account from accounts.json file
 * @param provider 
 */
export const deploy_braavos = async( id: number, provider: Provider ) => {

    let accounts: { [key: string | number]: any } = {}

    try {

        accounts = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        let { accountAddress, starkKeyPriv, starkKeyPub } = <AccountCreate> accounts[ id ]

        const account = new Account( provider, starkKeyPub, starkKeyPriv );
    
        /*========================================= TX ================================================================================================*/
        console.log(`\nDeploying contract address: ${ accountAddress } ...`)

        const tx = await deployBraavosAccount( starkKeyPriv, provider )

        console.log( "\nContract account deployed !" )
        console.log("hash: ", tx.transaction_hash )
        /*=============================================================================================================================================*/

    } catch (error) {
        
        console.log( error )

    }
}

/**
 * @notice Generate mnemonic / declare Bravos account / deploy Bravos account
 * @param signer    - Signer to fund the fresh Bravos account
 * @param network   - Mainnet or testnet
 * @param fundInit  - A specific ETH amount that will fund the new account (default needed is 0.0002 ETH)
 * @returns 
 */
export const full_deployment = async( signer: Account, network: 'TESTNET' | 'MAINNET', fundInit?: string ): Promise<string> => {

    const provider = network === 'TESTNET' ? TESTNET_PROVIDER : MAINNET_PROVIDER

    try {
        
        const id = await declare_braavos()
        const new_account = await get_account( id, provider )

        /*========================================= TXS ================================================================================================*/
        await fund( new_account.address, fundInit ?? '0.0002', signer, network )
        await deploy_braavos( id, provider )
        /*=============================================================================================================================================*/

        return new_account.address

    } catch (error) {
        
        throw( error )

    }
}