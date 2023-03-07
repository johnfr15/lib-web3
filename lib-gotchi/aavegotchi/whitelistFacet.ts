import { ethers } from "ethers"
import  FACET_ABI from "./abis/gotchiLendingFacet.json"
import { CONTRACT, SIGNER } from "../constant"

/*
  |***********************************|
  |        FACET INTERFACE            |
  |___________________________________| 

  EVENT
  -  eventWhitelistCreated(uint32indexedwhitelistId);
  -  eventWhitelistUpdated(uint32indexedwhitelistId);
  -  eventWhitelistOwnershipTransferred(uint32indexedwhitelistId,addressindexednewOwner);

  READ
  -  getWhitelistAccessRight(uint32 _whitelistId, uint256 _actionRight) external view returns (uint256)
  -  getBorrowLimit(uint32 _whitelistId) external view returns (uint256)
  -  setBorrowLimit(uint32 _whitelistId, uint256 _borrowlimit) external
  -  whitelistExists(uint32 whitelistId) external view returns (bool exists)
  -  isWhitelisted(uint32 _whitelistId, address _whitelistAddress) external view returns (uint256)
  -  getWhitelistsLength() external view returns (uint256)
  -  getWhitelist(uint32 _whitelistId) external view returns (Whitelist memory)
  -  whitelistOwner(uint32 _whitelistId) external view returns (address)

  WRITE
  -  createWhitelist(string calldata _name, address[] calldata _whitelistAddresses) external
  -  updateWhitelist(uint32 _whitelistId, address[] calldata _whitelistAddresses) external
  -  removeAddressesFromWhitelist(uint32 _whitelistId, address[] calldata _whitelistAddresses) external
  -  transferOwnershipOfWhitelist(uint32 _whitelistId, address _whitelistOwner) external
  -  setWhitelistAccessRight(uint32 _whitelistId, uint256 _actionRight, uint256 _accessRight) external
*/

export const gotchiLendingFacet = new ethers.Contract(CONTRACT.aavegotchi.aavegotchi, FACET_ABI.abi, SIGNER)





/***********************************|
|               READ                |
|__________________________________*/

/**
 * @name getWhitelistAccessRight
 * @notice Query the access right of a whitelist
 * @param _whitelistId identifier of the whitelist to query
 * @param _actionRight identifier of the action to query the access right for
 * @return uint256 the access right of the action for the whitelist
*/
export const getWhitelistAccessRight = async(whitelistId: number, actionRight: number): Promise<number> => {
  try {
    const accessRight = await gotchiLendingFacet.getWhitelistAccessRight(whitelistId, actionRight)
    return accessRight
  } catch (error: any) {
    throw new Error(error)
  }
}

/**
 * @name getBorrowLimit
 * @notice Query the borrow limit of a whitelist
 * @param _whitelistId The identifier of the whitelist to query
 * @return uint256 the borrow limit of the whitelist
*/
export const getBorrowLimit = async (whitelistId: number): Promise<number> => {
  try {
    const borrowLimit = await gotchiLendingFacet.getBorrowLimit(whitelistId)
    return borrowLimit
  } catch (error: any) {
    throw new Error(error)
  }
}

export const removeAddressesFromWhitelist = async (_whitelistId: number, _whitelistAddresses: string[]): Promise<void> => {
  try {
    await gotchiLendingFacet.removeAddressesFromWhitelist(_whitelistId, _whitelistAddresses);
  } catch (error: any) {
    throw new Error(error);
  }
}

/**

@name transferOwnershipOfWhitelist
@notice Transfer ownership of a whitelist to a new address
@param _whitelistId The identifier of the whitelist to transfer ownership of
@param _whitelistOwner The address to transfer ownership of the whitelist to
@returns nothing
*/
export const transferOwnershipOfWhitelist = async (_whitelistId: number, _whitelistOwner: string): Promise<void> => {
  try {
    await gotchiLendingFacet.transferOwnershipOfWhitelist(_whitelistId, _whitelistOwner);
  } catch (error: any) {
    throw new Error(error);
  }
}
/**

@name setWhitelistAccessRight
@notice Set the access right for an action on a whitelist
@param _whitelistId The identifier of the whitelist to set the access right for
@param _actionRight The action for which to set the access right
@param _accessRight The access right to set for the action on the whitelist
@returns nothing
*/
export const setWhitelistAccessRight = async (_whitelistId: number, _actionRight: number, _accessRight: number): Promise<void> => {
try {
await gotchiLendingFacet.setWhitelistAccessRight(_whitelistId, _actionRight, _accessRight);
} catch (error: any) {
throw new Error(error);
}
}