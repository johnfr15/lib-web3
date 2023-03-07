import { ethers } from "ethers"
import  FACET_ABI from "./abis/lendingGetterAndSetterFacet.json"
import { SIGNER, TOKENS, CONTRACT } from "../constant"
import { AavegotchiInfo, GotchiLending, LendingOperatorInputs } from "./types";
import { getGasPrice } from "../utils";

/*
  |***********************************|
  |        FACET INTERFACE            |
  |___________________________________| 

  EVENT
    -  LendingOperatorSet(address indexed lender, address indexed lendingOperator, uint32 indexed tokenId, bool isLendingOperator);

  READ
    -  revenueTokenAllowed(address token) external view returns (bool)
    -  getTokenBalancesInEscrow(uint32 _tokenId, address[] calldata _revenueTokens) external view returns (uint256[] memory revenueBalances)
    -  isLendingOperator( address _lender, address _lendingOperator, uint32 _tokenId) external view returns (bool) 
    -  getLendingListingInfo(uint32 _listingId) external view returns (GotchiLending memory listing_)
    -  getGotchiLendingFromToken(uint32 _erc721TokenId) external view returns (GotchiLending memory listing_)
    -  getGotchiLendingIdByToken(uint32 _erc721TokenId) external view returns (uint32)
    -  getOwnerGotchiLendings(address _lender, bytes32 _status, uint256 _length) external view returns (GotchiLending[] memory listings_) 
    -  getOwnerGotchiLendingsLength(address _lender, bytes32 _status) external view returns (uint256)
    -  getGotchiLendings(bytes32 _status, uint256 _length) external view returns (GotchiLending[] memory listings_)
    -  getLentTokenIdsOfLender(address _lender) external view returns (uint32[] memory tokenIds_)
    -  balanceOfLentGotchis(address _lender) external view returns (uint256 balance_)
    -  getGotchiLendingsLength() external view returns (uint256)
    -  isAavegotchiLent(uint32 _erc721TokenId) external view returns (bool)
    -  isAavegotchiListed(uint32 _erc721TokenId) external view returns (bool)

  WRITE
    !  allowRevenueTokens(address[] calldata tokens) external onlyOwner
    !  disallowRevenueTokens(address[] calldata tokens) external onlyOwner
    -  setLendingOperator(address _lendingOperator, uint32 _tokenId, bool _isLendingOperator) public onlyAavegotchiOwner(_tokenId) onlyUnlocked(_tokenId) 
    -  batchSetLendingOperator(address _lendingOperator, LendingOperatorInputs[] calldata _inputs) external
    -  getGotchiLendingListingInfo(uint32 _listingId)
*/

export const lendingGetterAndSetterFacet = new ethers.Contract( CONTRACT.aavegotchi.aavegotchi, FACET_ABI.abi, SIGNER)





/***********************************|
|                READ               |
|__________________________________*/

export const revenueTokenAllowed = async (token: string): Promise<boolean> => {
  try {
    const isAllowed = await lendingGetterAndSetterFacet.revenueTokenAllowed(token);
    return isAllowed;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getTokenBalancesInEscrow = async (
  tokenId: number, 
  revenueTokens: string[] = [TOKENS.fud, TOKENS.fomo, TOKENS.alpha, TOKENS.kek, TOKENS.ghst]
) => {
  try {
    let revenueBalances = await lendingGetterAndSetterFacet.getTokenBalancesInEscrow(tokenId, revenueTokens);
    revenueBalances = revenueBalances.map((balance: any) => ethers.utils.formatEther(balance))

    if (revenueTokens[4] === TOKENS.ghst)
      return {fud: revenueBalances[0], fomo: revenueBalances[1], alpha: revenueBalances[2], kek: revenueBalances[3], ghst: revenueBalances[4]};
    else
      return revenueBalances

  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name isLendingOperator
 * @param lender 
 * @param lendingOperator 
 * @param tokenId 
 * @returns 
 */
export const isLendingOperator = async (lender: string, lendingOperator: string, tokenId: number): Promise<boolean> => {
  try {
    const isOperator = await lendingGetterAndSetterFacet.isLendingOperator(lender, lendingOperator, tokenId);
    return isOperator;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name getLendingListingInfo
 * @notice Get an aavegotchi lending details through an identifier
 * @dev Will throw if the lending does not exist
 * @param listingId The identifier of the lending to query
 * @return listing_ A struct containing certain details about the lending like timeCreated etc
 * @return aavegotchiInfo_ A struct containing details about the aavegotchi
 */
export const getLendingListingInfo = async (listingId: number): Promise<AavegotchiInfo> => {
  try {
    const listingInfo = await lendingGetterAndSetterFacet.getLendingListingInfo(listingId);
    return listingInfo;
  } catch (error: any) {
    throw new Error(error);
  }
};


/**
 * @name getGotchiLendingFromToken
 * Get the lending information of a gotchi token
 * @param tokenId The identifier of the gotchi token
 * @returns The lending information of the gotchi token
 */
export const getGotchiLendingFromToken = async (tokenId: number): Promise<GotchiLending> => {
  try {
    const listing = await lendingGetterAndSetterFacet.getGotchiLendingFromToken(tokenId);
    return listing;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name getGotchiLendingIdByToken
 * Get the lending listing id of a gotchi token
 * @param tokenId The identifier of the gotchi token
 * @returns The lending listing id of the gotchi token
 */
export const getGotchiLendingIdByToken = async (tokenId: number): Promise<number> => {
  try {
    const listingId = await lendingGetterAndSetterFacet.getGotchiLendingIdByToken(tokenId);
    return listingId;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name getOwnerGotchiLendings
 * Get the lending listings of a specific owner
 * @param lender The address of the owner
 * @param status The status of the listings
 * @param length The number of listings to retrieve
 * @returns The lending listings of the specific owner
 */
export const getOwnerGotchiLendings = async (lender: string, status: string, length: number): Promise<GotchiLending[]> => {
  try {
    const listings = await lendingGetterAndSetterFacet.getOwnerGotchiLendings(lender, status, length);
    return listings;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name getOwnerGotchiLendingsLength
 * Get the number of lending listings of a specific owner
 * @param lender The address of the owner
 * @param status The status of the listings
 * @returns The number of lending listings of the specific owner
 */
export const getOwnerGotchiLendingsLength = async (lender: string, status: string): Promise<number> => {
  try {
    const length = await lendingGetterAndSetterFacet.getOwnerGotchiLendingsLength(lender, status);
    return length;
  } catch (error: any) {
    throw new Error(error);
  }
};
    
/**
 * @name getGotchiLendings
 * Get the lending listings
 * @param status The status of the listings
 * @param length The number of listings to retrieve
 * @returns The lending listings
*/
export const getGotchiLendings = async (status: string, length: number): Promise<GotchiLending[]> => {
  try {
    const listings = await lendingGetterAndSetterFacet.getGotchiLendings(status, length);
    return listings;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name getLentTokenIdsOfLender
 * Get the token ids of the gotchis lent by a specific lender
 * @param lender The address of the lender
 * @returns The token ids of the gotchis lent by the specific lender
*/
export const getLentTokenIdsOfLender = async (lender: string): Promise<number[]> => {
  try {
    const tokenIds = await lendingGetterAndSetterFacet.getLentTokenIdsOfLender(lender);
    return tokenIds;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name balanceOfLentGotchis
 * Get the balance of lent gotchis of a specific lender
 * @param lender The address of the lender
 * @returns The balance of lent gotchis of the specific lender
*/
export const balanceOfLentGotchis = async (lender: string): Promise<ethers.BigNumber> => {
  try {
    const balance = await lendingGetterAndSetterFacet.balanceOfLentGotchis(lender);
    return balance;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name getGotchiLendingsLength
 * Get the number of lending listings
 * @returns The number of lending listings
*/
export const getGotchiLendingsLength = async (): Promise<number> => {
  try {
    const length = await lendingGetterAndSetterFacet.getGotchiLendingsLength();
    return length;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name isAavegotchiLent
 * Check if a gotchi is lent
 * @param tokenId The identifier of the gotchi token
 * @returns A boolean indicating whether the gotchi is lent or not
*/
export const isAavegotchiLent = async (tokenId: number): Promise<boolean> => {
  try {
    const isLent = await lendingGetterAndSetterFacet.isAavegotchiLent(tokenId);
    return isLent;
  } catch (error: any) {
    throw new Error(error);
  }
}

/**
 * @name isAavegotchiListed
 * Check if a gotchi is listed for lending
 * @param tokenId The identifier of the gotchi token
 * @returns A boolean indicating whether the gotchi is listed for lending or not
 */
export const isAavegotchiListed = async (tokenId: number): Promise<boolean> => {
  try {
    const isListed = await lendingGetterAndSetterFacet.isAavegotchiListed(tokenId);
    return isListed;
  } catch (error: any) {
    throw new Error(error);
  }
};











/***********************************|
|               WRITE               |
|__________________________________*/

/**
 * @name allowRevenueTokens
 * Allow revenue tokens
 * @param tokens The addresses of the tokens to allow
 */
export const allowRevenueTokens = async (tokens: string[]) => {
  try {
    console.log("Allowing revenue tokens...");
    const tx = await lendingGetterAndSetterFacet.allowRevenueTokens(tokens, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Revenue tokens allowed successfully");
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name disallowRevenueTokens
 * Disallow revenue tokens
 * @param tokens The addresses of the tokens to disallow
 */
// export const disallowRe

/**
@name setLendingOperator
Set the lending operator for a specific gotchi
@param operator The address of the lending operator
@param tokenId The identifier of the gotchi
@param isOperator A boolean indicating whether the address should be set as a lending operator or not
*/
export const setLendingOperator = async (operator: string, tokenId: number, isOperator: boolean) => {
  try {
    console.log("Setting lending operator...");
    const tx = await lendingGetterAndSetterFacet.setLendingOperator(operator, tokenId, isOperator, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Lending operator set successfully");
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name batchSetLendingOperator
 * Set the lending operator for multiple gotchis in a batch
 * @param operator The address of the lending operator
 * @param inputs An array of objects containing the tokenId and isOperator for each gotchi
 */
export const batchSetLendingOperator = async (operator: string, inputs: LendingOperatorInputs[]) => {
  try {
    console.log(`Setting ${operator} as lending operator for gotchis: ${inputs}`)
    const tx = await lendingGetterAndSetterFacet.batchSetLendingOperator(operator, inputs, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Lending operator set in batch successfully");
  } catch (error: any) {
    throw new Error(error);
  }
};
/**

@name getGotchiLendingListingInfo
Get the information of a specific lending listing
@param listingId The identifier of the lending listing
@returns The information of the lending listing
*/
export const getGotchiLendingListingInfo = async (listingId: number) => {
  try {
    const listing = await lendingGetterAndSetterFacet.getGotchiLendingListingInfo(listingId);
    return listing;
  } catch (error: any) {
    throw new Error(error);
  }
};