
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
