import fs from "fs"
import { Provider, Account } from "starknet"

const FILE_PATH = __dirname + "/../accounts.json"

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