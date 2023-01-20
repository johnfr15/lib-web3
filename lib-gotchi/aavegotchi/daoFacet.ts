import { ethers } from "ethers"
import FACET_ABI from "./abis/DAOFacet.json"
import { AAVEGOTCHI_DIAMOND_ADDRES, SIGNER } from "../constant"

/*
  |***********************************|
  |        FACET INTERFACE            |
  |___________________________________| 

  EVENT 
    -  DaoTransferred(address indexed previousDao, address indexed newDao);
    -  DaoTreasuryTransferred(address indexed previousDaoTreasury, address indexed newDaoTreasury);
    -  UpdateCollateralModifiers(int16[NUMERIC_TRAITS_NUM] _oldModifiers, int16[NUMERIC_TRAITS_NUM] _newModifiers);
    -  AddCollateralType(AavegotchiCollateralTypeIO _collateralType);
    -  AddItemType(ItemType _itemType);
    -  CreateHaunt(uint256 indexed _hauntId, uint256 _hauntMaxSize, uint256 _portalPrice, bytes32 _bodyColor);
    -  GrantExperience(uint256[] _tokenIds, uint256[] _xpValues);
    -  AddWearableSet(WearableSet _wearableSet);
    -  UpdateWearableSet(uint256 _setId, WearableSet _wearableSet);
    -  ItemTypeMaxQuantity(uint256[] _itemIds, uint256[] _maxQuanities);
    -  GameManagerAdded(address indexed gameManager_, uint256 indexed limit_, uint256 refreshTime_);
    -  GameManagerRemoved(address indexed gameManager_);
    -  ItemManagerAdded(address indexed newItemManager_);
    -  ItemManagerRemoved(address indexed itemManager_);
    -  WearableSlotPositionsSet(uint256 _wearableId, bool[EQUIPPED_WEARABLE_SLOTS] _slotPositions);
    -  ItemModifiersSet(uint256 _wearableId, int8[6] _traitModifiers, uint8 _rarityScoreModifier);
    -  RemoveExperience(uint256[] _tokenIds, uint256[] _xpValues);
    -  UpdateItemPrice(uint256 _itemId, uint256 _priceInWei);

  READ
    -  isGameManager(address _manager) external view returns (bool)
    -  gameManagerBalance(address _manager) external view returns (uint256)
    -  gameManagerRefreshTime(address _manager) external view returns (uint256)
    
  WRITE
    !  setDao(address _newDao, address _newDaoTreasury) external onlyDaoOrOwner
    !  addCollateralTypes(uint256 _hauntId, AavegotchiCollateralTypeIO[] calldata _collateralTypes) public onlyItemManager
    !  addItemManagers(address[] calldata _newItemManagers) external onlyDaoOrOwner
    !  removeItemManagers(address[] calldata _itemManagers) external onlyDaoOrOwner
    !  updateCollateralModifiers(address _collateralType, int16[NUMERIC_TRAITS_NUM] calldata _modifiers) external onlyDaoOrOwner
    !  updateItemTypeMaxQuantity(uint256[] calldata _itemIds, uint256[] calldata _maxQuantities) external onlyItemManager
    !  createHaunt(uint24 _hauntMaxSize, uint96 _portalPrice, bytes3 _bodyColor ) external onlyDaoOrOwner returns (uint256 hauntId_) 
    !  createHauntWithPayload(CreateHauntPayload calldata _payload) external onlyItemManager returns (uint256 hauntId_)
    !  mintItems(address _to, uint256[] calldata _itemIds, uint256[] calldata _quantities) external onlyItemManager
    !  grantExperience(uint256[] calldata _tokenIds, uint256[] calldata _xpValues) external onlyOwnerOrDaoOrGameManager
    !  removeExperience(uint256[] calldata _tokenIds, uint256[] calldata _xpValues) external onlyOwnerOrDaoOrGameManager
    !  addItemTypes(ItemType[] memory _itemTypes) external onlyItemManager
    !  addItemTypesAndSvgs(ItemType[] memory _itemTypes, string calldata _svg, LibSvg.SvgTypeAndSizes[] calldata _typesAndSizes) external onlyItemManager
    !  addWearableSets(WearableSet[] memory _wearableSets) external onlyItemManager
    !  updateWearableSets(uint256[] calldata _setIds, WearableSet[] calldata _wearableSets) external onlyItemManager
    !  addGameManagers(address[] calldata _newGameManagers, uint256[] calldata _limits) external onlyDaoOrOwner
    !  removeGameManagers(address[] calldata _gameManagers) external onlyDaoOrOwner
    !  setWearableSlotPositions(uint256 _wearableId, bool[EQUIPPED_WEARABLE_SLOTS] calldata _slotPositions) external onlyItemManager
    !  setItemTraitModifiersAndRarityModifier(uint256 _wearableId, int8[6] calldata _traitModifiers, uint8 _rarityScoreModifier) external onlyItemManager
    !  batchUpdateItemsPrice(uint256[] calldata _itemIds, uint256[] calldata _newPrices) public onlyItemManager 
*/

export const daoFacet = new ethers.Contract(AAVEGOTCHI_DIAMOND_ADDRES, FACET_ABI.abi, SIGNER)




/***********************************|
|               READ                |
|__________________________________*/

/**
 * @name isGameManager
 * @notice Query if an address is a game manager
 * @param manager Address to query
 * @return True if `_manager` is a game manager,False otherwise
 */
export const isGameManager = async(manager: string): Promise<boolean> => {
  try {
      const collaterals = await daoFacet.isGameManager(manager)
      return collaterals
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name gameManagerBalance
 * @notice Query the balance of a game manager
 * @param _manager Address to query
 * @return Balance of game manager `_manager`
 */
export const gameManagerBalance = async(manager: string): Promise<number> => {
  try {
      const collaterals = await daoFacet.gameManagerBalance(manager)
      return collaterals
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name gameManagerRefreshTime
 * @notice Query the refresh time of a game manager
 * @param _manager Address to query
 * @return Refresh time of game manager `_manager`
 */
export const gameManagerRefreshTime = async(manager: string): Promise<number> => {
  try {
      const collaterals = await daoFacet.gameManagerRefreshTime(manager)
      return collaterals
  } catch (error: any) {
      throw new Error(error)
  }
}