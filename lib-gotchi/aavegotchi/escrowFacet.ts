import { ethers } from "ethers"
import  FACET_ABI from "./abis/EscrowFacet.json"
import { CONTRACT, SIGNER } from "../constant"
import { getGasPrice } from "../utils";
/*
  |***********************************|
  |        FACET INTERFACE            |
  |___________________________________| 

  EVENT
    -  Erc20Deposited(uint256 indexed _tokenId, address indexed _erc20Contract, address indexed _from, address _to, uint256 _depositAmount);
    -  TransferEscrow(uint256 indexed _tokenId, address indexed _erc20Contract, address _from, address indexed _to, uint256 _transferAmount);

  READ
    -  gotchiEscrow(uint256 _tokenId) public view returns (address)
    -  escrowBalance(uint256 _tokenId, address _erc20Contract) external view returns (uint256)
    
    WRITE
    -  depositERC20( uint256 _tokenId, address _erc20Contract, uint256 _value) public 
    -  batchDepositERC20(uint256[] calldata _tokenIds, address[] calldata _erc20Contracts, uint256[] calldata _values) external
    -  batchDepositGHST(uint256[] calldata _tokenIds, uint256[] calldata _values) external
    -  transferEscrow(uint256 _tokenId, address _erc20Contract, address _recipient, uint256 _transferAmount) external onlyAavegotchiOwner(_tokenId) onlyUnlocked(_tokenId)
*/

export const escrowFacet = new ethers.Contract( CONTRACT.aavegotchi.aavegotchi, FACET_ABI.abi, SIGNER)





/***********************************|
|               READ                |
|__________________________________*/

/**
 * @name gotchiEscrow
 * @notice Returns the address of the escrow contract that holds the collateral for a specific Aavegotchi
 * @param _tokenId The identifier of the Aavegotchi
 * @return The address of the escrow contract that holds the collateral for Aavegotchi `_tokenId`
 */
export const gotchiEscrow = async(_tokenId: number): Promise<string> => {
  try {
      const escrowAddress = await escrowFacet.gotchiEscrow(_tokenId)
      return escrowAddress
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name escrowBalance
 * @param tokenId 
 * @param erc20Contract 
 * @returns 
 */
export const escrowBalance = async (tokenId: number, erc20Contract: string): Promise<number> => {
  try {
      return await escrowFacet.escrowBalance(tokenId, erc20Contract);
  } catch(error: any) {
      throw new Error(error);
  }
}









/***********************************|
|               WRITE               |
|__________________________________*/

/**
 * @name depositERC20
 * @notice Allow the deposit of an ERC20 token to the escrow contract of a claimed aavegotchi
 * @dev Will throw if token being deposited is same as collateral token for the aavegotchi
 * @param _tokenId The identifier of the NFT receiving the ERC20 token
 * @param _erc20Contract The contract address of the ERC20 token to be deposited
 * @param _value The amount of ERC20 tokens to deposit
 */
export const depositERC20 = async (tokenId: number, erc20Contract: string, value: number): Promise<void> => {
  try {
      console.log(`Sending token to gothi: ${tokenId}...`)
      const tx = await escrowFacet.depositERC20(tokenId, erc20Contract, value, { gasPrice: await getGasPrice() });
      await tx.wait()
      console.log("Transaction validated !\n")
  } catch (error: any) {
      throw new Error(error);
  }
}

/**
 * @name batchDepositERC20
 * @notice Allow the deposit of multiple ERC20 tokens to the escrow contract of a multiple claimed aavegotchis
 * @dev Will throw if one of the tokens being deposited is same as collateral token for the corresponding aavegotchi
 * @param tokenIds An array containing the identifiers of the NFTs receiving the ERC20 tokens
 * @param erc20Contracts An array containing the contract addresses of the ERC20 tokens to be deposited
 * @param values An array containing the amounts of ERC20 tokens to deposit
 */
export const batchDepositERC20 = async (tokenIds: number[], erc20Contracts: string[], values: number[]): Promise<void> => {
  try {
      console.log(`Sending tokens to gothis: ${tokenIds}...`)
      const tx = await escrowFacet.batchDepositERC20(tokenIds, erc20Contracts, values, { gasPrice: await getGasPrice() });
      await tx.wait()
      console.log("Transaction validated !\n")
  } catch(error: any) {
      throw new Error(error);
  }
}

/**
 * @name batchDepositGHST
 * @notice Allow the deposit of GHST into the escrow of multiple aavegotchis
 * @param tokenIds An array containing the identifiers of the NFTs receiving GHST
 * @param values An array containing the amounts of ERC20 tokens to deposit into each aavegotchi
 */
export const batchDepositGHST = async (tokenIds: number[], values: number[]): Promise<void> => {
  try {
      console.log(`Sending GHST to gothis: ${tokenIds}...`)
      const tx = await escrowFacet.batchDepositGHST(tokenIds, values, { gasPrice: await getGasPrice() });
      await tx.wait()
  } catch(error: any) {
      throw new Error(error);
  }
}

/**
 * @name transferEscrow
 * @notice Allow the owner of the aavegotchi to transfer out any ERC20 token in the escrow to an external address
 * @dev Will throw if there is an attempt to transfer out the collateral ERC20 token
 * @param tokenId Identifier of NFT holding the ERC20 token
 * @param erc20Contract Contract address of ERC20 token to transfer out
 * @param recipient Address of the receiver
 * @param transferAmount Amount of ERC20 tokens to transfer out
 */
export async function transferEscrow(tokenId: number, erc20Contract: string, recipient: string, transferAmount: number): Promise<void> {
  try {
      console.log(`Transferring ${transferAmount} from escrow for token ${tokenId} to ${recipient}...`);
      const tx = await escrowFacet.transferEscrow(tokenId, erc20Contract, recipient, ethers.utils.parseEther(transferAmount.toString()), { gasPrice: await getGasPrice() });
      await tx.wait();
      console.log("Transaction validated!");
  } catch (error: any) {
      throw new Error(error);
  }
}