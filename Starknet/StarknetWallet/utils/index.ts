import fs from "fs"
import { ethers } from "ethers"
import { ec, Provider, Account, Contract, uint256 } from "starknet"
import { mnemonicToSeedSync, generateMnemonic } from "@scure/bip39"
import { wordlist } from '@scure/bip39/wordlists/english'
import { HDKey } from "@scure/bip32"
import { HDNode } from "../type"
import ERC20_ABI from "../abis/erc20"
import { TOKENS } from "../Braavos/constants"

/**
 * @dev Get one of the nodes of your wallet
 * 
 * @param mnemonic      - A 12/24 words phrase 
 * @param path          - The path of the node needed (example of a starknet path node: "m/44'/9004'/0'/0")  
 * @param pathIndex     - (optional) The index of node. '0' is the first child node
 * @param password      - (optional) A password used to derive child's node
 * @returns {HDNode}    - Return the a specific node using the mnemonic and its specific path
 */
export const get_node = ( mnemonic: string, path: string, pathIndex = 0, password = '' ): HDNode => {

    const seed: Uint8Array = mnemonicToSeedSync( mnemonic, password )
    const childNode: any = HDKey.fromMasterSeed( seed ).derive( path + '/' + pathIndex )

    const node: HDNode = {
        address: ethers.hexlify( childNode.pubHash! ),
        privateKey: ethers.hexlify( childNode.privateKey ),
        publicKey: ethers.hexlify( childNode.publicKey ),
        fingerprint: childNode.fingerprint,
        parentFingerprint: childNode.parentFingerprint,
        mnemonic: {
            phrase: mnemonic,
            password: password,
            wordlist: 'en',
            entropy: ''
        },
        chainCode: ethers.hexlify( childNode.chainCode ),
        path: path,
        pathIndex: childNode.index,
        depth: childNode.depth
    }

    return node 
}

/**
 * @dev Generate a randomn mnemonic phrase using bip39 standart and then derive the first child node by default
 *      using starknet path => "m/44'/9004'/0'/0"
 * 
 * @returns - The HD node derived by "path" at index 0 by default
 *          - The private key of that node
 *          - The public key of that node  
 */
export const gen_stark_key_pair = (): { node: any, privateKey: string, publicKey: string } => {

    // Use the official wordlist of bip39 and generate a 12 words (128 bits) mnemonic phrase
    const mnemonic = generateMnemonic( wordlist, 128 );
    const path = "m/44'/9004'/0'/0"    
    
    const node = get_node( mnemonic, path )

    const privateKey = ec.starkCurve.grindKey( node.privateKey! )
    const publicKey = ec.starkCurve.getStarkKey( privateKey )

    return { 
        node: node, 
        privateKey: "0x" + privateKey, 
        publicKey: publicKey 
    }
}

/**
 * @notice Get account already deployed 
 * 
 * @param id            - The id of the accounts from FILE_PATH
 * @param provider      - A "starknet" Provider instance
 * @returns {Account}   - A instance of "starknet" Account ready to use and sign txs
 */
export const get_account = async( id: number, provider: Provider ): Promise<Account> => {

    let accounts: { [key: string | number]: any } = {}
    const FILE_PATH = __dirname + "/../accounts.json"

    try {

        accounts = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        let { accountAddress, privateKey } = accounts[ id ]

        const account = new Account( provider, accountAddress, privateKey );

        return account
        
    } catch (error) {
        
       throw( error )

    }
}

/**
 * @notice Fund "recipient" account with ETH tokens
 * 
 * @param recipent      - Account to receive the fund
 * @param amountETH     - Amount to send
 * @param signer        - Your starknet account
 * @param network       - On testnet or mainnet
 */
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