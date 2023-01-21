import { ethers } from "ethers"
import dotenv from "dotenv";
import FACET_ABI from "./abis/AavegotchiFacet.json"
import { AAVEGOTCHI_DIAMOND_ADDRES, SIGNER, PROVIDER } from "../constant";
import { AavegotchiInfo } from "./types";
import { getGasPrice } from "../utils";
dotenv.config()


/*
  |***********************************|
  |        FACET INTERFACE            |
  |___________________________________| 

  EVENT
  -  event PetOperatorApprovalForAll(address indexed _owner, address indexed _operator, bool _approved)

  READ
  -  totalSupply() external view returns (uint256 totalSupply_)
  -  balanceOf(address _owner) external view returns (uint256 balance_)
  -  getAavegotchi(uint256 _tokenId) external view returns (struct)
  -  aavegotchiClaimTime(uint256 _tokenId) external view returns (uint256 claimTime_)
  -  tokenByIndex(uint256 _index) external view returns (uint256 tokenId_) 
  -  tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256 tokenId_)
  -  tokenIdsOfOwner(address _owner) external view returns (uint32[] memory tokenIds_)
  -  allAavegotchisOfOwner(address _owner) external view returns (AavegotchiInfo[] memory aavegotchiInfos_)
  -  batchOwnerOf(uint256[] calldata _tokenIds) external view returns (address[] memory owners_)
  -  ownerOf(uint256 _tokenId) external view returns (address owner_)
  -  getApproved(uint256 _tokenId) external view returns (address approved_)
  -  isApprovedForAll(address _owner, address _operator) external view returns (bool approved_)
  -  isPetOperatorForAll(address _owner, address _operator) external view returns (bool approved_)
  -  name() external view returns (string memory)
  -  symbol() external view returns (string memory) 
  -  tokenURI(uint256 _tokenId) external pure returns (string memory) 

  WRITE
  -  safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata _data) external
  -  safeBatchTransferFrom(address _from, address _to, uint256[] calldata _tokenIds, bytes calldata _data)
  -  transferFrom(address _from, address _to, uint256 _tokenId) external
  -  approve(address _approved, uint256 _tokenId) external
  -  setApprovalForAll(address _operator, bool _approved) external 
  -  setPetOperatorForAll(address _operator, bool _approved) external 
*/

export const aavegotchiFacet = new ethers.Contract(AAVEGOTCHI_DIAMOND_ADDRES, FACET_ABI.abi, SIGNER)



/***********************************|
|               READ                |
|__________________________________*/

/**
 * @name totalSupply
 */

// Return the total amounts of gotchis
export const totalSupply = async(): Promise<number> => {

  try {
    const supply = await aavegotchiFacet.totalSupply()
    return supply.toNumber()
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name balanceOf
 */

export const balanceOf = async(owner: string): Promise<number> => {

  try {
    const balance = await aavegotchiFacet.balanceOf(owner)
    return balance.toNumber()
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name getAavegotchi
 */

// Get all the gotchis id of an owner
export const getAavegotchi = async(tokenId: number): Promise<AavegotchiInfo> => {

  try {
    const gotchi = await aavegotchiFacet.getAavegotchi(tokenId)
    return gotchi
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name aavegotchiClaimTime
 */
// The block timestamp when this Aavegotchi was claimed
export const aavegotchiClaimTime = async(tokenId: number): Promise<number> => {

  try {
    const claimed = await aavegotchiFacet.aavegotchiClaimTime(tokenId)
    return claimed.toNumber()
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name tokenByIndex
 */
export const tokenByIndex = async(index: number): Promise<number> => {

  try {
    const tokenId = await aavegotchiFacet.tokenByIndex(index)
    return tokenId.toNumber()
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name tokenOfOwnerByIndex
 */
export const tokenOfOwnerByIndex = async(owner: string, index: number): Promise<number> => {

  try {
    return (await aavegotchiFacet.tokenOfOwnerByIndex(owner, index))
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name tokenIdsOfOwner
 */
// Get all the gotchis id of an owner
export const tokenIdsOfOwner = async(owner: string): Promise<number[]> => {

  try {
    const tokenIds = await aavegotchiFacet.tokenIdsOfOwner(owner)
    return tokenIds
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name allAavegotchisOfOwner
 */

export const allAavegotchisOfOwner = async(owner: string): Promise<AavegotchiInfo[]> => {

  try {
    const gotchis = await aavegotchiFacet.allAavegotchisOfOwner(owner)
    return gotchis
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name batchOwnerOf
 */

export const batchOwnerOf = async(tokenIds: number[]): Promise<string[]> => {

  try {
    const owners = await aavegotchiFacet.batchOwnerOf(tokenIds)
    return owners
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name ownerOf
 */

export const ownerOf = async(tokenId: number): Promise<string> => {

  try {
    const owner = await aavegotchiFacet.ownerOf(tokenId)
    return owner
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name getApproved
 */

export const getApproved = async(tokenId: number): Promise<string> => {

  try {
    const approvedAddress = await aavegotchiFacet.getApproved(tokenId)
    return approvedAddress
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name isApprovedForAll
 */

export const isApprovedForAll = async(owner: string, operator: string): Promise<boolean> => {

  try {
    const isApprovedForAll = await aavegotchiFacet.isApprovedForAll(owner, operator)
    return isApprovedForAll
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name isPetOperatorForAll
 */

// Allow an address to "pet" all your gotchi
export const isPetOperatorForAll = async(owner: string, operator: string): Promise<boolean> => {

  try {
    const isPetOperatorForAll = await aavegotchiFacet.isPetOperatorForAll(owner, operator)
    return isPetOperatorForAll
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name name
 */

export const name = async(): Promise<string> => {

  try {
    const name = await aavegotchiFacet.name()
    return name
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name symbol
 */

export const symbol = async(): Promise<string> => {

  try {
    const symbol = await aavegotchiFacet.symbol()
    return symbol
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name tokenURI
 */

export const tokenURI = async(tokenId: number): Promise<string> => {

  try {
    const tokenURI = await aavegotchiFacet.tokenURI()
    return tokenURI
  } catch (error: any) {
    throw new Error(error)
  }

}













/***********************************|
|               WRITE               |
|__________________________________*/

/**
 * @name safeTransferFrom
 */
export const safeTransferFrom = async(from: string, to: string, tokenId: number, data: string = "0x") => {

  try {
    console.log(`Transfer token: ${tokenId} from: ${from} to: ${to}...`)
    const tx = await aavegotchiFacet.safeTransferFrom(from, to, tokenId, data, {gasPrice: await getGasPrice()})
    await tx.wait()

    console.log("Transaction validated !\n")
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name safeBatchTransferFrom
 */
export const safeBatchTransferFrom = async(from: string, to: string, tokenIds: number[], data: string = "0x") => {

  try {
    console.log(`Transfer token: ${tokenIds}\n from: ${from} to: ${to}...`)
    const tx = await aavegotchiFacet.safeBatchTransferFrom(from, to, tokenIds, data, {gasPrice: await getGasPrice()})
    await tx.wait()

    console.log("Transaction validated !\n")
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name transferFrom
 */
export const transferFrom = async(from: string, to: string, tokenId: number) => {

  try {
    console.log(`Transfer token: ${tokenId} from: ${from} to: ${to}...`)
    const tx = await aavegotchiFacet.transferFrom(from, to, tokenId, {gasPrice: await getGasPrice()})
    await tx.wait()

    console.log("Transaction validated !\n")
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name approve
 */
export const approve = async(approved: string, tokenId: number) => {

  try {
    console.log(`Approve ${approved} for token: ${tokenId}...`)
    const tx = await aavegotchiFacet.approve(approved, tokenId, {gasPrice: await getGasPrice()})
    await tx.wait()

    console.log("Transaction validated !\n")
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name approve
 */
export const setApprovalForAll = async(operator: string, approved: boolean) => {

  try {
    console.log(`Approve ${approved} to ${operator} for all tokens...`)
    const tx = await aavegotchiFacet.setApprovalForAll(operator, approved, {gasPrice: await getGasPrice()})
    await tx.wait()

    console.log("Transaction validated !\n")
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name setPetOperatorForAll
 */
// Allow an address to "pet" all your gotchi
export const setPetOperatorForAll = async(operator: string, approved: boolean) => {

  try {
    console.log(`Setting ${operator} as a pet operator...`)
    const tx = await aavegotchiFacet.setPetOperatorForAll(operator, approved, {gasPrice: await getGasPrice()})
    await tx.wait()
    console.log("Transaction validated !\n")
  } catch (error: any) {
    throw new Error(error)
  }

}

