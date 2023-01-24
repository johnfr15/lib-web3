import { ethers } from "ethers"
import  FACET_ABI from "./abis/EscrowFacet.json"
import { AAVEGOTCHI_DIAMOND_ADDRES, SIGNER } from "../constant"
import { AddGotchiListing, BatchRenew } from "./types";
import { getGasPrice } from "../utils";

/*
  |***********************************|
  |        FACET INTERFACE            |
  |___________________________________|

  EVENT
    -  GotchiLendingAdd(uint32 indexed listingId);
    -  GotchiLendingExecute(uint32 indexed listingId);
    -  GotchiLendingCancel(uint32 indexed listingId, uint256 time);
    -  GotchiLendingClaim(uint32 indexed listingId, address[] tokenAddresses, uint256[] amounts);
    -  GotchiLendingEnd(uint32 indexed listingId);
    -  GotchiLendingAdded(
        uint32 indexed listingId,
        address indexed lender,
        uint32 indexed tokenId,
        uint96 initialCost,
        uint32 period,
        uint8[3] revenueSplit,
        address originalOwner,
        address thirdParty,
        uint32 whitelistId,
        address[] revenueTokens,
        uint256 timeCreated
    );
    -  GotchiLendingExecuted(
        uint32 indexed listingId,
        address indexed lender,
        address indexed borrower,
        uint32 tokenId,
        uint96 initialCost,
        uint32 period,
        uint8[3] revenueSplit,
        address originalOwner,
        address thirdParty,
        uint32 whitelistId,
        address[] revenueTokens,
        uint256 timeAgreed
    );
    -  GotchiLendingCanceled(
        uint32 indexed listingId,
        address indexed lender,
        uint32 indexed tokenId,
        uint96 initialCost,
        uint32 period,
        uint8[3] revenueSplit,
        address originalOwner,
        address thirdParty,
        uint32 whitelistId,
        address[] revenueTokens,
        uint256 timeCanceled
    );
    -  GotchiLendingClaimed(
        uint32 indexed listingId,
        address indexed lender,
        address indexed borrower,
        uint32 tokenId,
        uint96 initialCost,
        uint32 period,
        uint8[3] revenueSplit,
        address originalOwner,
        address thirdParty,
        uint32 whitelistId,
        address[] revenueTokens,
        uint256[] amounts,
        uint256 timeClaimed
    );
    -  GotchiLendingEnded(
        uint32 indexed listingId,
        address indexed lender,
        address indexed borrower,
        uint32 tokenId,
        uint96 initialCost,
        uint32 period,
        uint8[3] revenueSplit,
        address originalOwner,
        address thirdParty,
        uint32 whitelistId,
        address[] revenueTokens,
        uint256 timeEnded
    );

  WRITE
  -  addGotchiListing(AddGotchiListing memory p) public {
  -  cancelGotchiLending(uint32 _listingId) public {
  -  agreeGotchiLending( uint32 _listingId, uint32 _erc721TokenId, uint96 _initialCost, uint32 _period, uint8[3] calldata _revenueSplit) external
  -  claimGotchiLending(uint32 tokenId) public {
  -  claimAndEndGotchiLending(uint32 tokenId) public {
  -  extendGotchiLending(uint32 tokenId, uint32 extension) public {
  -  addGotchiLending(uint32 _erc721TokenId, uint96 _initialCost, uint32 _period, uint8[3] calldata _revenueSplit, address _originalOwner, address _thirdParty, uint32 _whitelistId, address[] calldata _revenueTokens) external
  -  cancelGotchiLendingByToken(uint32 _erc721TokenId) public {
  -  claimAndEndAndRelistGotchiLending(uint32 tokenId) public {
  -  batchAddGotchiListing(AddGotchiListing[] memory listings) external {
  -  batchCancelGotchiLending(uint32[] calldata listingIds) external {
  -  batchCancelGotchiLendingByToken(uint32[] calldata _erc721TokenIds) external {
  -  batchClaimGotchiLending(uint32[] calldata tokenIds) external {
  -  batchClaimAndEndGotchiLending(uint32[] calldata tokenIds) external {
  -  batchClaimAndEndAndRelistGotchiLending(uint32[] calldata tokenIds) external {
  -  batchExtendGotchiLending(BatchRenew[] calldata _batchRenewParams) external { 
*/

export const gotchiLendingFacet = new ethers.Contract(AAVEGOTCHI_DIAMOND_ADDRES, FACET_ABI.abi, SIGNER)





/***********************************|
|               WRITE               |
|__________________________________*/

/**
 * @name addGotchiListing
 * Add a Gotchi listing
 * @param p The parameters for the listing
 */
export const addGotchiListing = async (p: AddGotchiListing) => {
  try {
    console.log("Adding Gotchi listing...");
    const tx = await gotchiLendingFacet.addGotchiListing(p, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Gotchi listing added successfully");
  } catch (error: any) {
    throw new Error(error)
  }
}

/**
 * @name cancelGotchiLending
 * Cancel a Gotchi lending listing
 * @param listingId The ID of the listing to cancel
 */
export const cancelGotchiLending = async (listingId: number) => {
  try {
    console.log("Canceling Gotchi lending listing...");
    const tx = await gotchiLendingFacet.cancelGotchiLending(listingId, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Gotchi lending listing canceled successfully");
  } catch (error: any) {
    throw new Error(error)
  }
}

/**
 * @name agreeGotchiLending
 * Agree to a Gotchi lending listing
 * @param listingId The ID of the listing to agree to
 * @param erc721TokenId The ID of the ERC721 token for the Gotchi
 * @param initialCost The initial cost of the lending in wei
 * @param period The period of the lending in seconds
 * @param revenueSplit The revenue split for the lender, borrower, and third party
 */
export const agreeGotchiLending = async (
  listingId: number,
  erc721TokenId: number,
  initialCost: number,
  period: number,
  revenueSplit: [number, number, number]
) => {
  try {
    console.log("Agreeing to Gotchi lending listing...");
    const tx = await gotchiLendingFacet.agreeGotchiLending(
      listingId,
      erc721TokenId,
      initialCost,
      period,
      revenueSplit,
      { gasPrice: await getGasPrice() }
    );
    await tx.wait();
    console.log("Agreed to Gotchi lending listing successfully");
  } catch (error: any) {
    throw new Error(error)
  }
}

/**
 * @name claimGotchiLending
 * Claim a Gotchi lending
 * @param tokenId The ID of the Gotchi lending to claim
 */
export const claimGotchiLending = async (tokenId: number) => {
  try {
    console.log(`Claiming token with id: ${tokenId}...`);
    const tx = await gotchiLendingFacet.claimGotchiLending(tokenId, {gasPrice: await getGasPrice()});
    await tx.wait();
    console.log("Transaction validated!");
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name claimAndEndGotchiLending
 * Claim and end a Gotchi lending
 * @param tokenId The ID of the Gotchi lending to claim and end
 */
export const claimAndEndGotchiLending = async (tokenId: number) => {
  try {
    console.log(`Claiming and ending lending for token with id: ${tokenId}...`);
    const tx = await gotchiLendingFacet.claimAndEndGotchiLending(tokenId, {gasPrice: await getGasPrice()});
    await tx.wait();
    console.log("Transaction validated!");
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * @name extendGotchiLending
 * Extend a Gotchi lending listing
 * @param tokenId The ID of the token associated with the listing
 * @param extension The number of seconds to extend the listing
 */
export const extendGotchiLending = async (tokenId: number, extension: number) => {
  try {
    console.log("Extending Gotchi lending listing...");
    const tx = await gotchiLendingFacet.extendGotchiLending(tokenId, extension, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Gotchi lending listing extended successfully");
  } catch (error: any) {
    throw new Error(error)
  }
}

/**
 * @name addGotchiLending
 * Add a Gotchi lending listing
 * @param erc721TokenId The ID of the ERC721 token for the Gotchi
 * @param initialCost The initial cost of the lending in wei
 * @param period The period of the lending in seconds
 * @param revenueSplit The revenue split for the lender, borrower, and third party
 * @param originalOwner The original owner of the Gotchi
 * @param thirdParty The third party associated with the listing
 * @param whitelistId The whitelist ID associated with the listing
 * @param revenueTokens The revenue tokens associated with the listing
 */
export const addGotchiLending = async (
  erc721TokenId: number,
  initialCost: number,
  period: number,
  revenueSplit: [number, number, number],
  originalOwner: string,
  thirdParty: string,
  whitelistId: number,
  revenueTokens: string[]
) => {
  try {
    console.log("Adding Gotchi lending listing...");
    const tx = await gotchiLendingFacet.addGotchiLending(
      erc721TokenId,
      initialCost,
      period,
      revenueSplit,
      originalOwner,
      thirdParty,
      whitelistId,
      revenueTokens,
      { gasPrice: await getGasPrice() }
    );
    await tx.wait();
    console.log("Gotchi lending listing added successfully");
  } catch (error: any) {
    throw new Error(error)
  }
}

/**
 * @name cancelGotchiLendingByToken
 * Cancel a Gotchi lending listing by token ID
 * @param erc721TokenId The ID of the ERC721 token for the Gotchi
*/
export const cancelGotchiLendingByToken = async (erc721TokenId: number) => {
  try {
    console.log("Canceling Gotchi lending listing by token ID...");
    const tx = await gotchiLendingFacet.cancelGotchiLendingByToken( erc721TokenId, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Gotchi lending listing canceled successfully by token ID");
  } catch (error: any) {
    throw new Error(error)
  }
}

/**
 * @name claimAndEndAndRelistGotchiLending
 * Claim and end a Gotchi lending listing and relist it
 * @param tokenId The ID of the Gotchi lending listing
*/
export const claimAndEndAndRelistGotchiLending = async (tokenId: number) => {
  try {
  console.log("Claiming and ending Gotchi lending listing and relist it...");
  const tx = await gotchiLendingFacet.claimAndEndAndRelistGotchiLending(tokenId, { gasPrice: await getGasPrice() });
  await tx.wait();
  console.log("Gotchi lending listing claimed and ended and relisted successfully");
  } catch (error: any) {
    throw new Error(error)
  }
}

/**
 * @name batchAddGotchiListing
 * Add multiple Gotchi listings
 * @param listings The parameters for the listings
*/
export const batchAddGotchiListing = async (listings: AddGotchiListing[]) => {
  try {
    console.log("Adding multiple Gotchi listings...");
    const tx = await gotchiLendingFacet.batchAddGotchiListing(listings, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Multiple Gotchi listings added successfully");
  } catch (error: any) {
    console.error(error);
  }
}
 
/**
 * @name batchCancelGotchiLending
 * Cancel multiple Gotchi lending listings
 * @param listingIds The IDs of the listings to cancel
*/
export const batchCancelGotchiLending = async (listingIds: number[]) => {
  try {
    console.log("Canceling multiple Gotchi lending listings...");
    const tx = await gotchiLendingFacet.batchCancelGotchiLending(listingIds, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Multiple Gotchi lending listings canceled successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name batchCancelGotchiLendingByToken
 * Cancel Gotchi lending listings by token ID
 * @param erc721TokenIds The token IDs of the Gotchis for the listings to cancel
*/
export const batchCancelGotchiLendingByToken = async (erc721TokenIds: number[]) => {
  try {
    console.log("Canceling Gotchi lending listings by token ID...");
    const tx = await gotchiLendingFacet.batchCancelGotchiLendingByToken(erc721TokenIds, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Gotchi lending listings canceled by token ID successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name batchClaimGotchiLending
 * Claim multiple Gotchi lending listings
 * @param tokenIds The token IDs of the Gotchis for the listings to claim
*/
export const batchClaimGotchiLending = async (tokenIds: number[]) => {
  try {
    console.log("Claiming multiple Gotchi lending listings...");
    const tx = await gotchiLendingFacet.batchClaimGotchiLending(tokenIds, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Multiple Gotchi lending listings claimed successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name batchClaimAndEndGotchiLending
 * Claim and end multiple Gotchi lending listings
 * @param tokenIds The IDs of the listings to claim and end
 */
export const batchClaimAndEndGotchiLending = async (tokenIds: number[]) => {
  try {
    console.log("Claiming and ending multiple Gotchi lending listings...");
    const tx = await gotchiLendingFacet.batchClaimAndEndGotchiLending(tokenIds, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Gotchi lending listings claimed and ended successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name batchClaimAndEndAndRelistGotchiLending
 * Claim, end, and relist multiple Gotchi lending listings
 * @param tokenIds The IDs of the listings to claim, end, and relist
 */
export const batchClaimAndEndAndRelistGotchiLending = async (tokenIds: number[]) => {
  try {
    console.log("Claiming, ending, and relisting multiple Gotchi lending listings...");
    const tx = await gotchiLendingFacet.batchClaimAndEndAndRelistGotchiLending(tokenIds, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Gotchi lending listings claimed, ended, and relisted successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name batchExtendGotchiLending
 * Extend multiple Gotchi lending listings
 * @param batchRenewParams The parameters for the listings to extend
 */
export const batchExtendGotchiLending = async (batchRenewParams: BatchRenew[]) => {
  try {
    console.log("Extending multiple Gotchi lending listings...");
    const tx = await gotchiLendingFacet.batchExtendGotchiLending(batchRenewParams, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Gotchi lending listings extended successfully");
  } catch (error: any) {
    console.error(error);
  }
}
