export const EVENT_ABI = [
    "event GotchiLendingAdd(uint32 indexed listingId)",
    "event GotchiLendingExecute(uint32 indexed listingId)",
    "event GotchiLendingCancel(uint32 indexed listingId, uint256 time)",
    "event GotchiLendingClaim(uint32 indexed listingId, address[] tokenAddresses, uint256[] amounts)",
    "event GotchiLendingEnd(uint32 indexed listingId)",
    "event GotchiLendingAdded( uint32 indexed listingId, address indexed lender, uint32 indexed tokenId, uint96 initialCost, uint32 period, uint8[3] revenueSplit, address originalOwner, address thirdParty, uint32 whitelistId, address[] revenueTokens, uint256 timeCreated)",
    "event GotchiLendingExecuted( uint32 indexed listingId, address indexed lender, address indexed borrower, uint32 tokenId, uint96 initialCost, uint32 period, uint8[3] revenueSplit, address originalOwner, address thirdParty, uint32 whitelistId, address[] revenueTokens, uint256 timeAgreed)",
    "event GotchiLendingCanceled( uint32 indexed listingId, address indexed lender, uint32 indexed tokenId, uint96 initialCost, uint32 period, uint8[3] revenueSplit, address originalOwner, address thirdParty, uint32 whitelistId, address[] revenueTokens, uint256 timeCanceled)",
    "event GotchiLendingClaimed( uint32 indexed listingId, address indexed lender, address indexed borrower, uint32 tokenId, uint96 initialCost, uint32 period, uint8[3] revenueSplit, address originalOwner, address thirdParty, uint32 whitelistId, address[] revenueTokens, uint256[] amounts, uint256 timeClaimed)",
    "event GotchiLendingEnded( uint32 indexed listingId, address indexed lender, address indexed borrower, uint32 tokenId, uint96 initialCost, uint32 period, uint8[3] revenueSplit, address originalOwner, address thirdParty, uint32 whitelistId, address[] revenueTokens, uint256 timeEnded)",
]