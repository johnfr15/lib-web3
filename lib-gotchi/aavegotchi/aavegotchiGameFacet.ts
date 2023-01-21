import { ethers } from "ethers"
import dotenv from "dotenv";
import FACET_ABI from "./abis/AavegotchiGameFacet.json"
import * as AavegotchiFacet from "./aavegotchiFacet"
import { AAVEGOTCHI_DIAMOND_ADDRES, PROVIDER, SIGNER } from "../constant";
import { AavegotchiInfo, NUMERIC_TRAITS_NUM, Haunt, PortalAavegotchiTraitsIO, RevenueSharesIO, TokenIdsWithKinship } from "./types";
import { getGasPrice } from "../utils";

dotenv.config()

/*
  |***********************************|
  |        FACET INTERFACE            |
  |___________________________________| 

  EVENT
  -  ClaimAavegotchi(uint256 indexed _tokenId)
  -  LockAavegotchi(uint256 indexed _tokenId, uint256 _time)
  -  UnLockAavegotchi(uint256 indexed _tokenId, uint256 _time)
  -  SetAavegotchiName(uint256 indexed _tokenId, string _oldName, string _newName)
  -  SetBatchId(uint256 indexed _batchId, uint256[] tokenIds)
  -  SpendSkillpoints(uint256 indexed _tokenId, int16[4] _values)

  READ
  -  aavegotchiLevel(uint256 _experience) external pure returns (uint256 level_)
  -  aavegotchiNameAvailable(string _name) external view returns (bool available_)
  -  baseRarityScore(int16[] _numericTraits) external pure returns (uint256 rarityScore_)
  -  currentHaunt() external view returns (uint256 hauntId_, struct haunt_)
  -  getNumericTraits(uint256 _tokenId) external view returns (int16[NUMERIC_TRAITS_NUM] memory numericTraits_)
  -  ghstAddress() external view returns (address contract_)
  -  kinship(uint256 _tokenId) external view returns (uint256 score_)
  -  modifiedTraitsAndRarityScore(uint256 _tokenId) external view returns (int16[NUMERIC_TRAITS_NUM] memory numericTraits_, uint256 rarityScore_)
  -  portalAavegotchiTraits(uint256 _tokenId) external view returns (PortalAavegotchiTraitsIO[PORTAL_AAVEGOTCHIS_NUM] memory portalAavegotchiTraits_)
  -  rarityMultiplier(int16[] _numericTraits) external pure returns (uint256 multiplier_)
  -  revenueShares() external view returns (RevenueSharesIO memory)
  -  tokenIdsWithKinship(address _owner, uint256 _count, uint256 _skip, bool all) external view returns (struct tokenIdsWithKinship_)
  -  xpUntilNextLevel(uint256 _experience) external pure returns (uint256 requiredXp_)
  -  availableSkillPoints(uint256 _tokenId) public view returns (uint256)

  WRITE
  -  claimAavegotchi(uint256 _tokenId, uint256 _option, uint256 _stakeAmount) external returns (_tokenId)
  -  interact(uint256[] calldata _tokenIds) external
  !  realmInteract(uint256 _tokenId) external
  !  setRealmAddress(address _realm) public onlyOwner
  -  setAavegotchiName(uint256 _tokenId, string calldata _name) external returns (_tokenId)
  -  spendSkillPoints(uint256 _tokenId, int16[4] calldata _values) external returns (_tokenId)
*/
export const aavegotchiGameFacet = new ethers.Contract(AAVEGOTCHI_DIAMOND_ADDRES, FACET_ABI.abi, SIGNER)


/***********************************|
|               READ                |
|__________________________________*/

/**
 * @name aavegotchiLevel
 */

// Return the total amounts of gotchis
export const aavegotchiLevel = async(experience: number): Promise<number> => {

  try {
    const level = await aavegotchiGameFacet.aavegotchiLevel(experience)
    return level.toNumber()
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name aavegotchiNameAvailable
 */

// Return the total amounts of gotchis
export const aavegotchiNameAvailable = async(name: string): Promise<boolean> => {

  try {
    const isAvailble = await aavegotchiGameFacet.aavegotchiNameAvailable(name)
    return isAvailble
  } catch (error: any) {
    throw new Error(error)
  }

}

/**
 * @name baseRarityScore
 */

// Evaluate the rarity score based of the 6 gotchi trait
// @param numericTraits: An array of 6 int16
export const baseRarityScore = async(numericTraits: NUMERIC_TRAITS_NUM): Promise<number> => {

  try {
    const rarityScore = await aavegotchiGameFacet.baseRarityScore(numericTraits)
    return rarityScore.toNumber()
  } catch (error: any) { 
    throw new Error(error)
  }

}

/**
 * @name currentHaunt
 */

export const currentHaunt = async(): Promise<{hauntId: number, haunt: Haunt}> => {

  try {
    const currentHaunt = await aavegotchiGameFacet.currentHaunt()
    return currentHaunt
  } catch (error: any) { 
    throw new Error(error)
  }

}

/**
 * @name getNumericTraits
 */

export const getNumericTraits = async(tokenId: number): Promise<NUMERIC_TRAITS_NUM> => {

  try {
    const numTraits = await aavegotchiGameFacet.getNumericTraits(tokenId)
    return numTraits
  } catch (error: any) { 
    throw new Error(error)
  }

}

/**
 * @name ghstAddress
 */

export const ghstAddress = async(): Promise<string> => {

  try {
    const ghstAddress = await aavegotchiGameFacet.ghstAddress()
    return ghstAddress
  } catch (error: any) { 
    throw new Error(error)
  }

}

/**
 * @name kinship
 */

export const kinship = async(tokenId: number): Promise<number> => {

  try {
    const kinship = await aavegotchiGameFacet.kinship(tokenId)
    return kinship.toNumber()
  } catch (error: any) { 
    throw new Error(error)
  }

}

/**
 * @name modifiedTraitsAndRarityScore
 */

export const modifiedTraitsAndRarityScore = async(tokenId: number): Promise<{numericTraits: NUMERIC_TRAITS_NUM, rarityScore: number}> => {

  try {
    const modifiedNumericTraits = await aavegotchiGameFacet.modifiedTraitsAndRarityScore(tokenId)
    const filtered = modifiedNumericTraits.filter((element: any) => typeof(element) === "object")

    return {numericTraits: filtered[0], rarityScore: filtered[1]}
  } catch (error: any) { 
    throw new Error(error)
  }

}

/**
 * @name portalAavegotchiTraits
 */

export const portalAavegotchiTraits = async(tokenId: number): Promise<PortalAavegotchiTraitsIO[]> => {
  let filtered: PortalAavegotchiTraitsIO[] = []

  try {
    const portalAavegotchiTraits: any[] = await aavegotchiGameFacet.portalAavegotchiTraits(tokenId)
    
    filtered = portalAavegotchiTraits.map((gotchi: any[]) => {
      return {randomNumber: gotchi[0], numericTraits: gotchi[1], collateralType: gotchi[2], minimumStake: gotchi[3]}
    }); 
        
    return filtered
  } catch (error: any) { 
    throw new Error(error.reason + " or already sumonned")
  }

}

/**
 * @name rarityMultiplier
 */

export const rarityMultiplier = async(numericTraits: NUMERIC_TRAITS_NUM): Promise<number[]> => {

  try {
    const rarityMultiplier = await aavegotchiGameFacet.rarityMultiplier(numericTraits)
    return rarityMultiplier
  } catch (error: any) { 
    throw new Error(error.reason)
  }

}

/**
 * @name revenueShares
 */

export const revenueShares = async(): Promise<RevenueSharesIO> => {

  try {
    const revenueShares = await aavegotchiGameFacet.revenueShares()
    return revenueShares
  } catch (error: any) { 
    throw new Error(error.reason)
  }

}

/**
 * @name tokenIdsWithKinship
 */

export const tokenIdsWithKinship = async(owner: string, count: number, skip: number, all: boolean = false): Promise<TokenIdsWithKinship[]> => {
  let filtered: TokenIdsWithKinship[] = []
  try {
    const tokenIdsWithKinship = await aavegotchiGameFacet.tokenIdsWithKinship(owner, count, skip, all)
    filtered = tokenIdsWithKinship.map((el: any) => {
      return {tokenId: el.tokenId.toNumber(), kinship: el.kinship.toNumber(), lastInteracted: el.lastInteracted.toNumber()}
    } )

    return filtered
  } catch (error: any) { 
    throw new Error(error.reason)
  }

}

/**
 * @name xpUntilNextLevel
 */

export const xpUntilNextLevel = async(experience: number): Promise<number> => {

  try {
    const tokenIdsWithKinship = await aavegotchiGameFacet.xpUntilNextLevel(experience)
    return tokenIdsWithKinship.toNumber()
  } catch (error: any) { 
    throw new Error(error.reason)
  }

}

/**
 * @name availableSkillPoints
 */

export const availableSkillPoints = async(tokenId: number): Promise<number> => {

  try {
    const availableSkillPoints = await aavegotchiGameFacet.availableSkillPoints(tokenId)
    return availableSkillPoints.toNumber()
  } catch (error: any) { 
    throw new Error(error.reason)
  }

}










/***********************************|
|               WRITE               |
|__________________________________*/

/**
 * @name claimAavegotchi
 * @notice Allows the owner of an NFT(Portal) to claim an Aavegotchi provided it has been unlocked
 * @dev Will throw if the Portal(with identifier `_tokenid`) has not been opened(Unlocked) yet
 * @dev If the NFT(Portal) with identifier `_tokenId` is listed for sale on the baazaar while it is being unlocked, that listing is cancelled
 * @param _tokenId The identifier of NFT to claim an Aavegotchi from
 * @param _option The index of the aavegotchi to claim(1-10)
 * @param _stakeAmount Minimum amount of collateral tokens needed to be sent to the new aavegotchi escrow contract
 */
export const claimAavegotchi = async(tokenId: number, option: number, stakeAmount: number) => {

  try {
    console.log(`Sumonning gotchi: ${tokenId}...`)
    const tx = await aavegotchiGameFacet.claimAavegotchi( tokenId, option, stakeAmount, {gasPrice: await getGasPrice()} )
    await tx.wait()
    console.log("Transaction validated !\n")
  } catch (error) {
    console.log(error)
  }

}

/**
 * @name setAavegotchiName
 * @notice Allows the owner of a NFT to set a name for it
 * @dev only valid for claimed aavegotchis
 * @dev Will throw if the name has been used for another claimed aavegotchi
 * @param _tokenId the identifier if the NFT to name
 * @param _name Preferred name to give the claimed aavegotchi
 */
export const setAavegotchiName = async(tokenId: number, name: string) => {

  try {
    console.log(`Set gotchi: ${tokenId} a new name: ${name}...`)
    const tx = await aavegotchiGameFacet.setAavegotchiName( tokenId, name, {gasPrice: await getGasPrice()} )
    await tx.wait()
    console.log("Transaction validated !\n")
  } catch (error: any) {
   throw new Error(error.reason)
  }

}

/**
 * @name interact
 * @notice Allow the owner of an NFT to interact with them.thereby increasing their kinship(petting)
 * @dev only valid for claimed aavegotchis
 * @dev Kinship will only increase if the lastInteracted minus the current time is greater than or equal to 12 hours
 * @param _tokenIds An array containing the token identifiers of the claimed aavegotchis that are to be interacted with
 */
export const petGotchi = async(tokenId: number) => {

  try {
    console.log(`pet gotchi: ${tokenId}...`)
    const tx = await aavegotchiGameFacet.interact( [tokenId], {gasPrice: await getGasPrice()} )
    await tx.wait()
    console.log("Transaction validated !\n")
  } catch (error: any) {
    throw new Error(error.reason)
  }

}
// Pet all the gotchis of an owner
export const petAllGotchiOfOwner = async(owner: string) => {
  
  try {
    const gotchis: AavegotchiInfo[] = await AavegotchiFacet.allAavegotchisOfOwner(owner)
    const tokenIds: number[] = []
    
    gotchis.map((gotchi) => {
      if (gotchi.status.toNumber() === 3) 
      tokenIds.push(gotchi.tokenId.toNumber())
    })
    
    console.log(`pet all gotchis of: ${owner}...`)
    const tx = await aavegotchiGameFacet.interact( tokenIds, { gasPrice: await getGasPrice()} )
    await tx.wait()
    
    console.log("Transaction validated !")
    
  } catch (error: any) {
    throw new Error(error.reason)
  }
  
}

/**
 * @name spendSkillPoints
 * @notice Allow the owner of an NFT to spend skill points for it(basically to boost the numeric traits of that NFT)
 * @dev only valid for claimed aavegotchis
 * @param _tokenId The identifier of the NFT to spend the skill points on
 * @param _values An array of four integers that represent the values of the skill points 
 */
export const spendSkillPoints = async(tokenId: number, values: number[]) => {

  try {
    console.log(`pet gotchi: ${tokenId}...`)
    const tx = await aavegotchiGameFacet.spendSkillPoints( tokenId, values, {gasPrice: await getGasPrice()} )
    await tx.wait()
    console.log("Transaction validated !\n")
  } catch (error: any) {
    throw new Error(error.reason)
  }

}
