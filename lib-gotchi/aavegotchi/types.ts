import { ethers } from "ethers";

export type NUMERIC_TRAITS_NUM        = [number, number, number, number, number, number]
export type EQUIPPED_WEARABLE_SLOTS   = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]
export type TRAIT_BONUSES_NUM         = [number, number, number, number, number]
export type PORTAL_AAVEGOTCHIS_NUM    = [number, number, number, number, number, number, number, number, number, number]

export type ItemType = {
  name: string; //The name of the item
  description: string;
  author: string;
  // treated as int8s array
  // [Experience, Rarity Score, Kinship, Eye Color, Eye Shape, Brain Size, Spookiness, Aggressiveness, Energy]
  traitModifiers: number[]; //[WEARABLE ONLY] How much the wearable modifies each trait. Should not be more than +-5 total
  //[WEARABLE ONLY] The slots that this wearable can be added to.
  slotPositions: boolean[];
  // this is an array of uint indexes into the collateralTypes array
  allowedCollaterals: number[]; //[WEARABLE ONLY] The collaterals this wearable can be equipped to. An empty array is "any"
  // SVG x,y,width,height
  dimensions: Dimensions;
  ghstPrice: ethers.BigNumber; // How much GHST this item costs
  maxQuantity: ethers.BigNumber; //Total number that can be minted of this item.
  totalQuantity: ethers.BigNumber; //The total quantity of this item minted so far
  svgId: number; //The svgId of the item
  rarityScoreModifier: number; //Number from 1-50.
  // Each bit is a slot position. 1 is true, 0 is false
  canPurchaseWithGhst: boolean;
  minLevel: number; //The minimum Aavegotchi level required to use this item. Default is 1.
  canBeTransferred: boolean;
  category: number; // 0 is wearable, 1 is badge, 2 is consumable
  kinshipBonus: number; //[CONSUMABLE ONLY] How much this consumable boosts (or reduces) kinship score
  experienceBonus: number; //[CONSUMABLE ONLY]
}

export type Dimensions = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ItemTypeIO = {
  balance: ethers.BigNumber
  itemId: ethers.BigNumber;
  itemType: ItemType;
}

export type AavegotchiInfo = {
  tokenId: ethers.BigNumber;
  name: string;
  owner: string;
  randomNumber: ethers.BigNumber;
  status: ethers.BigNumber;
  numericTraits: number[];
  modifiedNumericTraits: number[];
  equippedWearables: number[];
  collateral: string;
  escrow: string;
  stakedAmount: ethers.BigNumber;
  minimumStake: ethers.BigNumber;
  kinship: ethers.BigNumber; //The kinship value of this Aavegotchi. Default is 50.
  lastInteracted: ethers.BigNumber;
  experience: ethers.BigNumber; //How much XP this Aavegotchi has accrued. Begins at 0.
  toNextLevel: ethers.BigNumber;
  usedSkillPoints: ethers.BigNumber; //number of skill points used
  level: ethers.BigNumber; //the current aavegotchi level
  hauntId: ethers.BigNumber;
  baseRarityScore: ethers.BigNumber;
  modifiedRarityScore: ethers.BigNumber;
  locked: boolean;
  items: ItemTypeIO[];
}
export type GotchiLending = {
  // storage slot 1
  lender: string;
  initialCost: number; // GHST in wei, can be zero
  // storage slot 2
  borrower: string;
  listingId: number;
  erc721TokenId: number;
  whitelistId: number; // can be zero
  // storage slot 3
  originalOwner: string; // if original owner is lender, same as lender
  timeCreated: number;
  timeAgreed: number;
  canceled: boolean;
  complete: boolean;
  // storage slot 4
  thirdParty: string; // can be address(0)
  revenueSplit: [number, number, number]; // lender/original owner, borrower, thirdParty
  lastClaimed: number; //timestamp
  period: number; //in seconds
  // storage slot 5
  revenueTokens: string[];
}

export type Haunt = {
  hauntMaxSize: number; //The max size of the Haunt
  portalPrice: number;
  bodyColor: string;
  totalCount: number;
}

export type PortalAavegotchiTraitsIO = {
  randomNumber: number;
  numericTraits: NUMERIC_TRAITS_NUM;
  collateralType: string;
  minimumStake: number;
}

export type RevenueSharesIO = {
  burnAddress: string;
  daoAddress: string;
  rarityFarming: string;
  pixelCraft: string;
}

export type TokenIdsWithKinship = {
  tokenId: number;
  kinship: number;
  lastInteracted: number;
}

export type AavegotchiCollateralTypeIO = {
  collateralType: string;
  collateralTypeInfo: AavegotchiCollateralTypeInfo;
}

export type AavegotchiCollateralTypeInfo = {
  // treated as an arary of int8
  modifiers: NUMERIC_TRAITS_NUM //Trait modifiers for each collateral. Can be 2, 1, -1, or -2
  primaryColor: string;
  secondaryColor: string;
  cheekColor: string;
  svgId: number;
  eyeShapeSvgId: number;
  conversionRate: number; //Current conversionRate for the price of this collateral in relation to 1 USD. Can be updated by the DAO
  delisted: boolean;
}

export type ERC721Listing = {
  listingId: number;
  seller: string;
  erc721TokenAddress: string;
  erc721TokenId: number;
  category: number; // 0 is closed portal, 1 is vrf pending, 2 is open portal, 3 is Aavegotchi
  priceInWei: number;
  timeCreated: number;
  timePurchased: number;
  cancelled: boolean;
  //new:
  principalSplit: [number, number];
  affiliate: string;
}

export type AavegotchiListing = {
  listing: ERC721Listing;
  aavegotchiInfo: AavegotchiInfo;
}

export type Category = {
  erc721TokenAddress: string;
  category: number; // 0,1,2,3 == Aavegotchi diamond, 4 == Realm diamond.
  // uint256 status; can add this in later if necessary
}

export type ERC1155Listing = {
  listingId: number;
  seller: string;
  erc1155TokenAddress: string;
  erc1155TypeId: number;
  category: number; // 0 is wearable, 1 is badge, 2 is consumable, 3 is tickets
  quantity: number;
  priceInWei: number;
  timeCreated: number;
  timeLastPurchased: number;
  sourceListingId: number;
  sold: boolean;
  cancelled: boolean;
  //new:
  principalSplit: [number, number];
  affiliate: string;
}
/**
 * @param erc721TokenId The identifier of the NFT to lend
 * @param initialCost The lending fee of the aavegotchi in $GHST
 * @param period The lending period of the aavegotchi, unit: second
 * @param revenueSplit The revenue split of the lending, 3 values, sum of the should be 100
 * @param originalOwner The account for original owner, can be set to another address if the owner wishes to have profit split there.
 * @param thirdParty The 3rd account for receive revenue split, can be address(0)
 * @param whitelistId The identifier of whitelist for agree lending, if 0, allow everyone
 */
export type AddGotchiListing = {
  tokenId: number;
  initialCost: number;
  period: number;
  revenueSplit: [number, number, number]; // 0: lender, 1: borrower, 2: third party
  originalOwner: string;
  thirdParty: string;
  whitelistId: number;
  revenueTokens: string[];
}

export type BatchRenew = {
  tokenId: number;
  extension: number;
}

export type LendingOperatorInputs = {
  tokenId: number;
  isLendingOperator: boolean;
}