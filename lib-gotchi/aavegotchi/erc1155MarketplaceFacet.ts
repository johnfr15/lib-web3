import { ethers } from "ethers"
import  FACET_ABI from "./abis/ERC1155MarketplaceFacet.json"
import { AAVEGOTCHI_DIAMOND_ADDRES, SIGNER } from "../constant"
import { ERC1155Listing, AavegotchiInfo, Category } from "./types";
import { getGasPrice } from "../utils";

/*
  |***********************************|
  |        FACET INTERFACE            |
  |___________________________________| 

  EVENT
    -  ERC1155ListingAdd(
        uint256 indexed listingId,
        address indexed seller,
        address erc1155TokenAddress,
        uint256 erc1155TypeId,
        uint256 indexed category,
        uint256 quantity,
        uint256 priceInWei,
        uint256 time
      )
    -  ERC1155ListingSplit(uint256 indexed listingId, uint16[2] principalSplit, address affiliate);
    -  ERC1155ExecutedListing(uint256 indexed listingId,
        address indexed seller,
        address buyer,
        address erc1155TokenAddress,
        uint256 erc1155TypeId,
        uint256 indexed category,
        uint256 _quantity,
        uint256 priceInWei,
        uint256 time
      )
    -  ERC1155ExecutedToRecipient(uint256 indexed listingId, address indexed buyer, address indexed recipient);
    -  ERC1155ListingCancelled(uint256 indexed listingId);
    -  ChangedListingFee(uint256 listingFeeInWei);

  READ
    -  getListingFeeInWei() external view returns (uint256) {
    -  getERC1155Listing(uint256 _listingId) external view returns (ERC1155Listing memory listing_) {
    -  getERC1155ListingFromToken(address _erc1155TokenAddress, uint256 _erc1155TypeId, address _owner) external view returns (ERC1155Listing memory listing_)
    -  getOwnerERC1155Listings(address _owner, uint256 _category, string memory _sort, uint256 _length) external view returns (ERC1155Listing[] memory listings_)
    -  getERC1155Listings(uint256 _category, string memory _sort, uint256 _length) external view returns (ERC1155Listing[] memory listings_)
    -  getERC1155Category(address _erc1155TokenAddress, uint256 _erc1155TypeId) public view returns (uint256 category_) {

  WRITE
    !  setListingFee(uint256 _listingFeeInWei) external onlyDaoOrOwner {
    !  setERC1155Categories(Category[] calldata _categories) external onlyOwnerOrItemManager 
    -  setERC1155Listing(address _ERC1155TokenAddress, uint256 _ERC1155TokenId, uint256 _quantity, uint256 _priceInWei) external
    -  setERC1155ListingWithSplit( address _ERC1155TokenAddress, uint256 _ERC1155TokenId, uint256 _quantity, uint256 _priceInWei, uint16[2] memory _principalSplit, address _affiliate) external
    -  cancelERC1155Listing(uint256 _listingId) external 
    -  executeERC1155Listing(uint256 _listingId, uint256 _quantity, uint256 _priceInWei) external 
    -  executeERC1155ListingToRecipient(uint256 _listingId, address _contractAddress, uint256 _itemId, uint256 _quantity, uint256 _priceInWei, address _recipient) external
    -  updateERC1155Listing(address _ERC1155TokenAddress, uint256 _ERC1155TokenId, address _owner) external
    -  updateBatchERC1155Listing(address _erc1155TokenAddress, uint256[] calldata _erc1155TypeIds, address _owner) external 
    -  cancelERC1155Listings(uint256[] calldata _listingIds) external onlyOwner

*/

export const erc1155MarketPlaceFacet = new ethers.Contract(AAVEGOTCHI_DIAMOND_ADDRES, FACET_ABI.abi, SIGNER)





/***********************************|
|               READ                |
|__________________________________*/

/**
 * @name getAavegotchiListing
 * @notice Get an aavegotchi listing details through an identifier
 * @dev Will throw if the listing does not exist
 * @param listingId The identifier of the listing to query
 * @return listing_ A struct containing certain details about the listing like timeCreated etc
 * @return aavegotchiInfo_ A struct containing details about the aavegotchi
 */
export const getAavegotchiListing = async (listingId: number): Promise<{listing: ERC1155Listing, aavegotchiInfo: AavegotchiInfo}> => {
  try {
      const [listing, aavegotchiInfo] = await erc1155MarketPlaceFacet.getAavegotchiListing(listingId);
      return { listing, aavegotchiInfo };
  } catch (error: any) {
      throw new Error(error);
  }
};

/**
 * @name getERC1155Listing
 * @notice Get an ERC1155 listing details through an identifier
 * @dev Will throw if the listing does not exist
 * @param _listingId The identifier of the ERC1155 listing to query
 * @return listing_ A struct containing certain details about the ERC1155 listing like timeCreated etc
 */
export const getERC1155Listing = async (listingId: number): Promise<ERC1155Listing> => {
  try {
      const listing = await erc1155MarketPlaceFacet.getERC1155Listing(listingId);
      return listing;
  } catch (error: any) {
      throw new Error(error);
  }
};

/**
 * @name getERC1155ListingFromToken
 * @notice Get an ERC1155 listing details through an NFT
 * @dev Will throw if the listing does not exist
 * @param _ERC1155TokenAddress The address of the NFT associated with the listing
 * @param _ERC1155TokenId The identifier of the NFT associated with the listing
 * @param _owner The owner of the NFT associated with the listing
 * @return listing_ A struct containing certain details about the ERC1155 listing associated with an NFT of contract address `_ERC1155TokenAddress` and identifier `_ERC1155TokenId`
 */
export const getERC1155ListingFromToken = async (ERC1155TokenAddress: string, ERC1155TokenId: number, owner: string): Promise<ERC1155Listing> => {
  try {
      const listing = await erc1155MarketPlaceFacet.getERC1155ListingFromToken(ERC1155TokenAddress, ERC1155TokenId, owner);
      return listing;
  } catch (error: any) {
      throw new Error(error);
  }
};

/**
 * @name getOwnerERC1155Listings
 * @notice Query a certain amount of ERC1155 listings created by an address based on their category and sortings
 * @param owner Creator of the listings to query
 * @param category Category of listings to query // 0 is wearable, 1 is badge, 2 is consumable, 3 is tickets
 * @param length How many ERC1155 listings to return
 * @param sort Sortings of listings to query // "listed" or "purchased"
 * @return listings_ An array of structs, each struct containing details about each listing being returned 
 */
export const getOwnerERC1155Listings = async (owner: string, category: number, length: number, sort: string = "listed"): Promise<ERC1155Listing[]> => {
  try {
      const listings = await erc1155MarketPlaceFacet.getOwnerERC1155Listings(owner, category, sort, length)
      return listings
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getERC1155Listings
 * @param category Category of listings to query // 0 is wearable, 1 is badge, 2 is consumable, 3 is tickets
 * @param length How many listings to return
 * @param sort Sortings of listings to query  // "listed" or "purchased"
 * @return listings_ An array of structs, each struct containing details about each listing being returned 
 * @returns 
 */
export const getERC1155Listings = async (category: number, length: number, sort: string = "listed"): Promise<ERC1155Listing[]> => {
  try {
      const listings = await erc1155MarketPlaceFacet.getERC1155Listings(category, sort, length)
      return listings
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getERC1155Category
 * @notice Query the category details of a ERC1155 NFT
 * @param erc1155TokenAddress Contract address of NFT to query
 * @param erc1155TypeId Identifier of the NFT to query
 * @return category_ Category of the NFT // 0 is wearable, 1 is badge, 2 is consumable, 3 is tickets
 */
export const getERC1155Category = async (erc1155TokenAddress: string, erc1155TypeId: number): Promise<number> => {
  try {
      const category = await erc1155MarketPlaceFacet.getERC1155Category(erc1155TokenAddress, erc1155TypeId)
      return category
  } catch (error: any) {
      throw new Error(error)
  }
}









/***********************************|
|               WRITE               |
|__________________________________*/

/**
 * @name setERC1155Categories
 * Set the categories for ERC1155 listings
 * @param categories The array of categories to set
 */
export const setERC1155Categories = async (categories: Category[]) => {
  try {
    console.log("Setting categories...")
    const tx = await erc1155MarketPlaceFacet.setERC1155Categories(categories, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Categories set successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name addERC1155Listing
 * @notice Allow an ERC1155 owner to list his NFT for sale
 * @dev If the NFT has been listed before,it cancels it and replaces it with the new one
 * @dev NFTs that are listed are immediately locked
 * @dev Will be deprecated soon, use addERC1155ListingWithSplit
 * @param ERC1155TokenAddress The contract address of the NFT to be listed
 * @param ERC1155TokenId The identifier of the NFT to be listed
 * @param quantity The amount of NFTs to be listed
 * @param price The cost price of the NFT in $GHST
 */
export const setERC1155Listing = async (
  ERC1155TokenAddress: string,
  ERC1155TokenId: number,
  quantity: number,
  price: string
) => {
  try {
    console.log(`Listing id: ${ERC1155TokenId} of ${ERC1155TokenAddress}...`)
    const tx = await erc1155MarketPlaceFacet.addERC1155Listing(ERC1155TokenAddress, ERC1155TokenId, quantity, ethers.utils.parseEther(price), { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Listing added successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name addERC1155ListingWithSplit
 * Add an ERC1155 listing with a split for the principal and affiliate
 * @param ERC1155TokenAddress The address of the ERC1155 token being listed
 * @param ERC1155TokenId The ID of the ERC1155 token being listed
 * @param quantity The amount of NFTs to be listed
 * @param price The price of the listing in wei
 * @param principalSplit The split for the principal. The both added number must be equal to 10000 (100%)
 * @param affiliate The address of the affiliate
 */
export const setERC1155ListingWithSplit = async (
  ERC1155TokenAddress: string,
  ERC1155TokenId: number,
  quantity: number,
  price: string,
  principalSplit: [number, number],
  affiliate: string
) => {
  try {
    console.log(`Listing id: ${ERC1155TokenId} of ${ERC1155TokenAddress}...`)
    const tx = await erc1155MarketPlaceFacet.addERC1155ListingWithSplit(
    ERC1155TokenAddress,
    ERC1155TokenId,
    quantity,
    ethers.utils.parseEther(price),
    principalSplit,
    affiliate,
    { gasPrice: await getGasPrice() }
    );
    await tx.wait();
    console.log("Listing added with split successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name cancelERC1155Listing
 * @notice Allow an ERC1155 owner to cancel his NFT listing through the listingID
 * @param listingId The identifier of the listing to be cancelled 
 */
export const cancelERC1155Listing = async (listingId: number) => {
  try {
      console.log(`Canceling listing: ${listingId}...`);
      const tx = await erc1155MarketPlaceFacet.cancelERC1155Listing(listingId, { gasPrice: await getGasPrice() })
      await tx.wait();
      console.log("Listing canceled successfully");
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name executeERC1155Listing
 * @notice Allow a buyer to execute an open listing i.e buy the NFT
 * @dev Will throw if the NFT has been sold or if the listing has been cancelled already
 * @dev Will be deprecated soon.
 * @param listingId The identifier of the listing to execute
 * @param quantity The amount of ERC1155 NFTs execute/buy
 */
export const executeERC1155Listing = async (listingId: number, quantity: number) => {
  try {
      const listing = await getERC1155Listing(listingId)

      console.log("Executing listing...");
      const tx = await erc1155MarketPlaceFacet.executeERC1155Listing(listingId, quantity, listing.priceInWei, { gasPrice: await getGasPrice() })
      await tx.wait();
      console.log("Listing executed successfully");
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name executeERC1155ListingToRecipient
 * @notice Allow a buyer to execute an open listing i.e buy the NFT on behalf of another address (the recipient). Also checks to ensure the item details match the listing.
 * @dev Will throw if the NFT has been sold or if the listing has been cancelled already
 * @param listingId The identifier of the listing to execute
 * @param contractAddress The token contract address
 * @param itemId the erc1155 token id
 * @param quantity The amount of ERC1155 NFTs execute/buy
 * @param priceInWei the cost price of the ERC1155 NFTs individually
 * @param recipient the recipient of the item
 */
export const executeERC1155ListingToRecipient = async (listingId: number, quantity: number, recipient: string) => {
  try {
      const listing = await getERC1155Listing(listingId)

      console.log(`Executing listing ${listingId} to ${recipient}...`);

      const tx = await erc1155MarketPlaceFacet.executeERC1155ListingToRecipient(
        listingId, 
        listing.erc1155TokenAddress, 
        listing.erc1155TypeId,
        quantity,
        listing.priceInWei, 
        recipient, 
        { gasPrice: await getGasPrice() }
      )
      await tx.wait();

      console.log("Listing executed successfully");
  } catch (error: any) {
      throw new Error(error.reason)
  }
}

/**
 * @name updateERC1155Listing
 * @notice Update the ERC1155 listing of an address
 * @param erc1155TokenAddress Contract address of the ERC1155 token
 * @param erc1155TypeId Identifier of the ERC1155 token
 * @param owner Owner of the ERC1155 token
 */
export const updateERC1155Listing = async (erc1155TokenAddress: string, erc1155TypeId: number, owner: string) => {
  try {
      console.log("Updating listing...");
      const tx = await erc1155MarketPlaceFacet.updateERC1155Listing(erc1155TokenAddress, erc1155TypeId, owner, { gasPrice: await getGasPrice() })
      await tx.wait();
      console.log("Listing updated successfully");
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name cancelERC1155Listings
 * @notice Allow an ERC1155 owner to cancel his NFT listings through the listingIDs
 * @param listingIds An array containing the identifiers of the listings to be cancelled 
 */
export const cancelERC1155Listings = async (listingIds: number[]) => {
  try {
      console.log(`Canceling of ids: ${listingIds}...`);
      const tx = await erc1155MarketPlaceFacet.cancelERC1155Listings(listingIds, { gasPrice: await getGasPrice() })
      await tx.wait();
      console.log("Listing canceled successfully");
  } catch (error: any) {
      throw new Error(error)
  }
}
// Remove all the portals(close & open)/gotchis/realm from the aavegotchi marketplace
export const cancelAllERC1155Listings = async () => {
  let listingIds: number[] = []

  try {
      for (const category of [0, 1, 2, 3]) {
        let listings = await getOwnerERC1155Listings(SIGNER.address, category, 1000)
        listings.forEach((el: any) => listingIds.push(el.listingId))
      }

      console.log(`Canceling of ids: ${listingIds}...`);
      const tx = await erc1155MarketPlaceFacet.cancelERC1155Listings(listingIds, { gasPrice: await getGasPrice() })
      await tx.wait();
      console.log("Listing canceled successfully");
  } catch (error: any) {
      throw new Error(error)
  }
}