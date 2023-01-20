import { ethers } from "ethers"
import  FACET_ABI from "./abis/ERC721MarketplaceFacet.json"
import { AAVEGOTCHI_DIAMOND_ADDRES, SIGNER, PROVIDER } from "../constant"
import { ERC721Listing, AavegotchiListing, AavegotchiInfo, Category } from "../types";
import { getGasPrice } from "../utils";

/*
  |***********************************|
  |        FACET INTERFACE            |
  |___________________________________| 

  EVENT
    -  ERC721ListingAdd(
        uint256 indexed listingId,
        address indexed seller,
        address erc721TokenAddress,
        uint256 erc721TokenId,
        uint256 indexed category,
        uint256 time
      )
    -  ERC721ListingSplit(uint256 indexed listingId, uint16[2] principalSplit, address affiliate);
    -  ERC721ExecutedListing(
        uint256 indexed listingId,
        address indexed seller,
        address buyer,
        address erc721TokenAddress,
        uint256 erc721TokenId,
        uint256 indexed category,
        uint256 priceInWei,
        uint256 time
      )
    -  ERC721ExecutedToRecipient(uint256 indexed listingId, address indexed buyer, address indexed recipient);

  READ
    -  getAavegotchiListing(uint256 _listingId) external view returns (ERC721Listing memory listing_, AavegotchiInfo memory aavegotchiInfo_)
    -  getERC721Listing(uint256 _listingId) external view returns (ERC721Listing memory listing_)
    -  getERC721ListingFromToken( address _erc721TokenAddress, uint256 _erc721TokenId, address _owner) external view returns (ERC721Listing memory listing_)
    -  getOwnerERC721Listings(address _owner, uint256 _category, string memory _sort, uint256 _length) external view returns (ERC721Listing[] memory listings_)
    -  getOwnerAavegotchiListings(address _owner, uint256 _category, string memory _sort, uint256 _length) external view returns (AavegotchiListing[] memory listings_)
    -  getERC721Listings(uint256 _category, string memory _sort, uint256 _length) external view returns (ERC721Listing[] memory listings_)
    -  getAavegotchiListings(uint256 _category, string memory _sort, uint256 _length) external view returns (AavegotchiListing[] memory listings_)
    -  getERC721Category(address _erc721TokenAddress, uint256 _erc721TokenId) public view returns (uint256 category_)
      
    WRITE
    !  setERC721Categories(Category[] calldata _categories) external onlyOwnerOrItemManager 
    -  addERC721Listing(address _erc721TokenAddress, uint256 _erc721TokenId, uint256 _priceInWei) external
    -  addERC721ListingWithSplit( address _erc721TokenAddress, uint256 _erc721TokenId, uint256 _priceInWei, uint16[2] memory _principalSplit, address _affiliate) external
    -  cancelERC721ListingByToken(address _erc721TokenAddress, uint256 _erc721TokenId) external
    -  cancelERC721Listing(uint256 _listingId) external 
    -  executeERC721Listing(uint256 _listingId) external 
    -  executeERC721ListingToRecipient(uint256 _listingId, address _contractAddress, uint256 _priceInWei, uint256 _tokenId, address _recipient) external
    -  updateERC721Listing(address _erc721TokenAddress, uint256 _erc721TokenId, address _owner) external
    -  cancelERC721Listings(uint256[] calldata _listingIds) external onlyOwner
*/

export const erc721MarketPlaceFacet = new ethers.Contract(AAVEGOTCHI_DIAMOND_ADDRES, FACET_ABI.abi, SIGNER)




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
export const getAavegotchiListing = async (listingId: number): Promise<{listing: ERC721Listing, aavegotchiInfo: AavegotchiInfo}> => {
  try {
      const [listing, aavegotchiInfo] = await erc721MarketPlaceFacet.getAavegotchiListing(listingId);
      return { listing, aavegotchiInfo };
  } catch (error: any) {
      throw new Error(error);
  }
};

/**
 * @name getERC721Listing
 * @notice Get an ERC721 listing details through an identifier
 * @dev Will throw if the listing does not exist
 * @param _listingId The identifier of the ERC721 listing to query
 * @return listing_ A struct containing certain details about the ERC721 listing like timeCreated etc
 */
export const getERC721Listing = async (listingId: number): Promise<ERC721Listing> => {
  try {
      const listing = await erc721MarketPlaceFacet.getERC721Listing(listingId);
      return listing;
  } catch (error: any) {
      throw new Error(error);
  }
};

/**
 * @name getERC721ListingFromToken
 * @notice Get an ERC721 listing details through an NFT
 * @dev Will throw if the listing does not exist
 * @param _erc721TokenAddress The address of the NFT associated with the listing
 * @param _erc721TokenId The identifier of the NFT associated with the listing
 * @param _owner The owner of the NFT associated with the listing
 * @return listing_ A struct containing certain details about the ERC721 listing associated with an NFT of contract address `_erc721TokenAddress` and identifier `_erc721TokenId`
 */
export const getERC721ListingFromToken = async (erc721TokenAddress: string, erc721TokenId: number, owner: string): Promise<ERC721Listing> => {
  try {
      const listing = await erc721MarketPlaceFacet.getERC721ListingFromToken(erc721TokenAddress, erc721TokenId, owner);
      return listing;
  } catch (error: any) {
      throw new Error(error);
  }
};

/**
 * @name getOwnerERC721Listings
 * @notice Query a certain amount of ERC721 listings created by an address based on their category and sortings
 * @notice category: 0,1,2,3 == Aavegotchi diamond, 4 == Realm diamond.
 * @param owner Creator of the listings to query
 * @param category Category of listings to query // 0 == portal, 1 == vrf pending, 2 == open portal, 3 == Aavegotchi.
 * @param length How many ERC721 listings to return
 * @param sort Sortings of listings to query // "listed" or "purchased"
 * @return listings_ An array of structs, each struct containing details about each listing being returned 
 */
export const getOwnerERC721Listings = async (owner: string, category: number, length: number, sort: string = "listed"): Promise<ERC721Listing[]> => {
  try {
      const listings = await erc721MarketPlaceFacet.getOwnerERC721Listings(owner, category, sort, length)
      return listings
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getOwnerAavegotchiListings
 * @notice Query a certain amount of aavegotchi listings created by an address based on their category and sortings
 * @notice category: 0,1,2,3 == Aavegotchi diamond, 4 == Realm diamond.
 * @param owner Creator of the listings to query
 * @param category Category of listings to query  // 0 == portal, 1 == vrf pending, 1 == open portal, 2 == Aavegotchi.
 * @param sort Sortings of listings to query // "listed" or "purchased"
 * @param length How many aavegotchi listings to return
 * @return listings_ An array of structs, each struct containing details about each listing being returned
 */
export const getOwnerAavegotchiListings = async (owner: string, category: number, length: number, sort: string = "listed"): Promise<AavegotchiListing[]> => {
  try {
      const listings = await erc721MarketPlaceFacet.getOwnerAavegotchiListings(owner, category, sort, length)
      return listings
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getERC721Listings
 * @param category Category of listings to query // 0 == portal, 1 == vrf pending, 2 == open portal, 3 == Aavegotchi, 4 == Realm diamond.
 * @param length How many listings to return
 * @param sort Sortings of listings to query  // "listed" or "purchased"
 * @return listings_ An array of structs, each struct containing details about each listing being returned 
 * @returns 
 */
export const getERC721Listings = async (category: number, length: number, sort: string = "listed"): Promise<ERC721Listing[]> => {
  try {
      const listings = await erc721MarketPlaceFacet.getERC721Listings(category, sort, length)
      return listings
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getERC721Category
 * @notice Query the category of an NFT
 * @param _erc721TokenAddress The contract address of the NFT to query
 * @param _erc721TokenId The identifier of the NFT to query
 * @return category_ Category of the NFT // 0 == portal, 1 == vrf pending, 2 == open portal, 3 == Aavegotchi 4 == Realm.
 */
export const getERC721Category = async (erc721TokenAddress: string, erc721TokenId: number): Promise<number> => {
  try {
      const category = await erc721MarketPlaceFacet.getERC721Category(erc721TokenAddress, erc721TokenId)
      return category
  } catch (error: any) {
      throw new Error(error)
  }
}









/***********************************|
|               WRITE               |
|__________________________________*/

/**
 * @name setERC721Categories
 * Set the categories for ERC721 listings
 * @param categories The array of categories to set
 */
export const setERC721Categories = async (categories: Category[]) => {
  try {
    console.log("Setting categories...")
    const tx = await erc721MarketPlaceFacet.setERC721Categories(categories, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Categories set successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name addERC721Listing
 * @notice Allow an ERC721 owner to list his NFT for sale
 * @dev If the NFT has been listed before,it cancels it and replaces it with the new one
 * @dev NFTs that are listed are immediately locked
 * @dev Will be deprecated soon, use addERC721ListingWithSplit
 * @param erc721TokenAddress The contract address of the NFT to be listed
 * @param erc721TokenId The identifier of the NFT to be listed
 * @param price The cost price of the NFT in $GHST
 */
export const addERC721Listing = async (
  erc721TokenAddress: string,
  erc721TokenId: number,
  price: string
) => {
  try {
    console.log(`Listing id: ${erc721TokenId} of ${erc721TokenAddress}...`)
    const tx = await erc721MarketPlaceFacet.addERC721Listing(erc721TokenAddress, erc721TokenId, ethers.utils.parseEther(price), { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Listing added successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name addERC721ListingWithSplit
 * Add an ERC721 listing with a split for the principal and affiliate
 * @param erc721TokenAddress The address of the ERC721 token being listed
 * @param erc721TokenId The ID of the ERC721 token being listed
 * @param price The price of the listing in wei
 * @param principalSplit The split for the principal. The both added number must be equal to 10000 (100%)
 * @param affiliate The address of the affiliate
 */
export const addERC721ListingWithSplit = async (
  erc721TokenAddress: string,
  erc721TokenId: number,
  price: string,
  principalSplit: [number, number],
  affiliate: string
) => {
  try {
    console.log(`Listing id: ${erc721TokenId} of ${erc721TokenAddress}...`)
    const tx = await erc721MarketPlaceFacet.addERC721ListingWithSplit(
    erc721TokenAddress,
    erc721TokenId,
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
 * @name cancelERC721ListingByToken
 * @notice Allow an ERC721 owner to cancel his NFT listing by providing the NFT contract address and identifier
 * @param erc721TokenAddress The contract address of the NFT to be delisted
 * @param erc721TokenId The identifier of the NFT to be delisted 
 */
export const cancelERC721ListingByToken = async (erc721TokenAddress: string, erc721TokenId: number) => {
  try {
    console.log("Canceling listing...");
    const tx = await erc721MarketPlaceFacet.cancelERC721ListingByToken(erc721TokenAddress, erc721TokenId, { gasPrice: await getGasPrice() })
    await tx.wait();
    console.log("Listing canceled successfully\n");
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name cancelERC721Listing
 * @notice Allow an ERC721 owner to cancel his NFT listing through the listingID
 * @param listingId The identifier of the listing to be cancelled 
 */
export const cancelERC721Listing = async (listingId: number) => {
  try {
      console.log(`Canceling listing: ${listingId}...`);
      const tx = await erc721MarketPlaceFacet.cancelERC721Listing(listingId, { gasPrice: await getGasPrice() })
      await tx.wait();
      console.log("Listing canceled successfully");
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name executeERC721Listing
 * @notice Allow a buyer to execute an open listing i.e buy the NFT
 * @dev Will throw if the NFT has been sold or if the listing has been cancelled already
 * @dev Will be deprecated soon.
 * @param listingId The identifier of the listing to execute
 */
export const executeERC721Listing = async (listingId: number) => {
  try {
      console.log("Executing listing...");
      const tx = await erc721MarketPlaceFacet.executeERC721Listing(listingId, { gasPrice: await getGasPrice() })
      await tx.wait();
      console.log("Listing added successfully");
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name executeERC721ListingToRecipient
 * @notice Allow a buyer to execute an open listing i.e buy the NFT on behalf of another address (the recipient). Also checks to ensure the item details match the listing.
 * @dev Will throw if the NFT has been sold or if the listing has been cancelled already
 * @param listingId The identifier of the listing to execute
 * @param contractAddress The token contract address
 * @param price The price of the item
 * @param tokenId the tokenID of the item
 * @param recipient The address to receive the NFT
 */
export const executeERC721ListingToRecipient = async (listingId: number, recipient: string) => {
  try {
      const listing = await getERC721Listing(listingId)
      console.log(`Executing listing ${listingId} to ${recipient}...`);

      const tx = await erc721MarketPlaceFacet.executeERC721ListingToRecipient(
        listingId, 
        listing.erc721TokenAddress, 
        listing.priceInWei, 
        listing.erc721TokenId, 
        recipient, 
        { gasPrice: await getGasPrice() }
      )
      await tx.wait();

      console.log("Listing added successfully");
  } catch (error: any) {
      throw new Error(error.reason)
  }
}

/**
 * @name updateERC721Listing
 * @notice Update the ERC721 listing of an address
 * @param erc721TokenAddress Contract address of the ERC721 token
 * @param erc721TokenId Identifier of the ERC721 token
 * @param owner Owner of the ERC721 token 
 */
export const updateERC721Listing = async (tokenAddress: string, tokenId: number, owner: string) => {
  try {
      console.log("Updating listing...");
      const tx = await erc721MarketPlaceFacet.updateERC721Listing(tokenAddress, tokenId, owner, { gasPrice: await getGasPrice() })
      await tx.wait();
      console.log("Listing updated successfully");
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name cancelERC721Listings
 * @notice Allow an ERC721 owner to cancel his NFT listings through the listingIDs
 * @param listingIds An array containing the identifiers of the listings to be cancelled 
 */
export const cancelERC721Listings = async (listingIds: number[]) => {
  try {
      console.log(`Canceling of ids: ${listingIds}...`);
      const tx = await erc721MarketPlaceFacet.cancelERC721Listings(listingIds, { gasPrice: await getGasPrice() })
      await tx.wait();
      console.log("Listing canceled successfully");
  } catch (error: any) {
      throw new Error(error)
  }
}
// Remove all the portals(close & open)/gotchis/realm from the aavegotchi marketplace
export const cancelAllERC721Listings = async () => {
  let listingIds: number[] = []

  try {
      for (const category of [0, 2, 3, 4]) {
        let listings = await getOwnerERC721Listings(SIGNER.address, category, 1000)
        listings.forEach((el: any) => listingIds.push(el.listingId))
      }

      console.log(`Canceling of ids: ${listingIds}...`);
      const tx = await erc721MarketPlaceFacet.cancelERC721Listings(listingIds, { gasPrice: await getGasPrice() })
      await tx.wait();
      console.log("Listing canceled successfully");
  } catch (error: any) {
      throw new Error(error)
  }
}