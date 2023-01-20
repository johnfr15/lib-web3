import { ethers } from "ethers"
import FACET_ABI from "./abis/BridgeFacet.json"
import { AAVEGOTCHI_DIAMOND_ADDRES, SIGNER } from "../constant";

/**
  |***********************************|
  |        FACET INTERFACE            |
  |___________________________________|

  EVENT  
  -   WithdrawnBatch(address indexed owner, uint256[] tokenIds);
  -   AddedAavegotchiBatch(address indexed owner, uint256[] tokenIds);
  -   AddedItemsBatch(address indexed owner, uint256[] ids, uint256[] values);
  -   WithdrawnItems(address indexed owner, uint256[] ids, uint256[] values);

  READ
  -  childChainManager() external view returns (address)
  
  WRITE
  !  deposit(address _user, bytes calldata _depositData) external
  !  setChildChainManager(address _newChildChainManager) external onlyDaoOrOwner
  -  withdrawItemsBatch(uint256[] calldata _ids, uint256[] calldata _values) external
  -  withdrawAavegotchiBatch(uint256[] calldata _tokenIds) external
 */

export const bridgeFacet = new ethers.Contract(AAVEGOTCHI_DIAMOND_ADDRES, FACET_ABI.abi, SIGNER)




/***********************************|
|               READ                |
|__________________________________*/

export const childChainManager = async(): Promise<string> => {
    try {
        const childChainManagerAddress = await bridgeFacet.childChainManager()
        return childChainManagerAddress
    } catch (error: any) {
        throw new Error(error)
    }
}










/***********************************|
|               WRITE               |
|__________________________________*/

/**
 * @name deposit
 * @notice called when token is deposited on root chain
 * @dev Should be callable only by ChildChainManager
 * Should handle deposit by minting or unlocking the required tokenId for user
 * Make sure minting is done only by this function
 * @param user user address for whom deposit is being done
 * @param depositData abi encoded tokenId
*/
export const deposit = async(user: string, depositData: string): Promise<void> => {

    try {
        console.log("Depositing tokens...")
        const tx = await bridgeFacet.deposit(user, depositData)
        await tx.wait()
        console.log("Transaction valided !\n")
    } catch (error: any) {
        throw new Error(error)
    }

}

/**
 * @name setChildChainManager
 * @notice Query the current address of the childChain Manager
 * @return The current address of the childChain Manager
 */
export const setChildChainManager = async(newChildChainManager: string): Promise<void> => {
    try {
        console.log(`New child chain manager: ${newChildChainManager}...`)
        const tx = await bridgeFacet.setChildChainManager(newChildChainManager)
        await tx.wait()
        console.log("Transaction valided !\n")
    } catch (error: any) {
        throw new Error(error)
    }
}

/**
 * @name withdrawAavegotchiBatch
 * @notice Allows a batch withdrawal of ERC721 NFTs by the owner
 * @dev Only 20 NFTs can be withdrawn in a single transaction, will throw if more than that
 * @param _tokenIds An array containing the identifiers of the NFTs to withdraw
 */
export const withdrawAavegotchiBatch = async(tokenIds: number[]): Promise<void> => {
    try {
        console.log(`Withdrawing tokens: ${tokenIds}...`)
        const tx = await bridgeFacet.withdrawAavegotchiBatch(tokenIds)
        await tx.wait()
        console.log("Transaction valided !\n")
    } catch (error: any) {
        throw new Error(error)
    }
}

/**
 * @name withdrawItemsBatch
 * @notice Allows abatch withdrawal of ERC1155 NFTs/items by the owner
 * @dev Only 20 items can be withdrawn in a single transaction, will throw if more than that
 * @param ids An array containing the identifiers of the items to withdraw
 * @param values An array containing the value/number of each item to withdraw
 */
export const withdrawItemsBatch = async(ids: number[], values: number[]): Promise<void> => {
    try {
        console.log(`Withdrawing items:\n   ids: ${ids}\n   values: ${values}...`)
        const tx = await bridgeFacet.withdrawItemsBatch( ids, values )
        await tx.wait()
        console.log("Transaction valided !\n")
    } catch (error: any) {
        throw new Error(error)
    }
}
