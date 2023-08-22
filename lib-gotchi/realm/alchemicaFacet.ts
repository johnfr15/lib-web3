import { ethers } from "ethers"
import axios from "axios";
import dotenv from "dotenv";
import FACET_ABI from "./abis/AlchemicaFacet.json"
import { CONTRACT, SIGNER, SIG_CHANNEL } from "../constant";
import { getGasPrice, getDelta } from "../utils";
import { Delta, Alchemicas } from "./types";

dotenv.config()

/*
  |***********************************|
  |        alchemicaFacet INTERFACE   |
  |___________________________________| 

  EVENT
  -  ChannelAlchemica(uint256 indexed _realmId, uint256 indexed _gotchiId, uint256[4] _alchemica, uint256 _spilloverRate, uint256 _spilloverRadius)
  -  ExitAlchemica(uint256 indexed _gotchiId, uint256[] _alchemica);
  -  SurveyingRoundProgressed(uint256 indexed _newRound);
  -  TransferTokensToGotchi(address indexed _sender, uint256 indexed _gotchiId, address _tokenAddresses, uint256 _amount);

  READ
  -  isSurveying(uint256 _realmId) external view returns (bool) {
  -  getAlchemicaAddresses() external view returns (address[4] memory) {
  -  getTotalAlchemicas() external view returns (uint256[4][5] memory) {
  -  getRealmAlchemica(uint256 _realmId) external view returns (uint256[4] memory) {
  -  getRoundAlchemica(uint256 _realmId, uint256 _roundId) external view returns (uint256[] memory) {
  -  getRoundBaseAlchemica(uint256 _realmId, uint256 _roundId) external view returns (uint256[] memory) {
  -  getAvailableAlchemica(uint256 _realmId) public view returns (uint256[4] memory _availableAlchemica) {
  -  lastClaimedAlchemica(uint256 _realmId) external view returns (uint256) {
  -  getHarvestRates(uint256 _realmId) external view returns (uint256[] memory harvestRates) {
  -  getCapacities(uint256 _realmId) external view returns (uint256[] memory capacities) {
  -  getTotalClaimed(uint256 _realmId) external view returns (uint256[] memory totalClaimed) {
  -  getLastChanneled(uint256 _gotchiId) public view returns (uint256) {
  -  getParcelLastChanneled(uint256 _parcelId) public view returns (uint256) {

  WRITE
  -  startSurveying(uint256 _realmId) external onlyParcelOwner(_realmId) gameActive {
  !  progressSurveyingRound() external onlyOwner {
  !  setVars(uint256[4][5] calldata _alchemicas, uint256[4] calldata _boostMultipliers, uint256[4] calldata _greatPortalCapacity, address _installationsDiamond, address _vrfCoordinator, address _linkAddress, address[4] calldata _alchemicaAddresses, address _gltrAddress, bytes memory _backendPubKey, address _gameManager, address _tileDiamond, address _aavegotchiDiamond) external onlyOwner
  !  setTotalAlchemicas(uint256[4][5] calldata _totalAlchemicas) external onlyOwner {
  -  claimAvailableAlchemica(claimAvailableAlchemica( uint256 _realmId, uint256 _gotchiId, bytes memory _signature) external gameActive
  -  channelAlchemica(channelAlchemica( uint256 _realmId, uint256 _gotchiId, uint256 _lastChanneled, bytes memory _signature) external gameActive
  -  batchTransferAlchemica(address[] calldata _targets, uint256[4][] calldata _amounts) external {
  -  batchTransferTokensToGotchis( uint256[] calldata _gotchiIds, address[] calldata _tokenAddresses, uint256[][] calldata _amounts) external
  !  setChannelingLimits(uint256[] calldata _altarLevel, uint256[] calldata _limits) external onlyOwner {
  -  batchTransferTokens(address[][] calldata _tokens, uint256[][] calldata _amounts, address[] calldata _to) external
*/

export const alchemicaFacet = new ethers.Contract(CONTRACT.aavegotchi.realm, FACET_ABI.abi, SIGNER)





/***********************************|
|               READ                |
|__________________________________*/

/**
 * @name isSurveying
 */
export const isSurveying = async (realmId: number): Promise<boolean> => {
  try {
      const result = await alchemicaFacet.isSurveying(realmId)
      return result
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getAlchemicaAddresses
 */
export const getAlchemicaAddresses = async(): Promise<string[]> => {
  try {
      const alchemicaAddresses = await alchemicaFacet.getAlchemicaAddresses()
      return alchemicaAddresses
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getTotalAlchemicas
 * @notice Query details about all total alchemicas present
 * @return output A two dimensional array, each representing an alchemica value
 */
export const getTotalAlchemicas = async (): Promise<number[][]> => {
  let alchemicas: number[][] = []
  try {
      const result = await alchemicaFacet.getTotalAlchemicas()

      alchemicas = result.map((array: any) => {
        return array.map((el: any) => ethers.utils.formatEther( el ) )
      })

      return alchemicas
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getRealmAlchemica
 * @notice Query details about the remaining alchemica in a parcel
 * @param realmId The identifier of the parcel to query
 * @return output An array containing details about each remaining alchemica in the parcel
 *  - output[O] = FUD
 *  - output[1] = FOMO
 *  - output[2] = ALPHA
 *  - output[3] = KEK
 */
export const getRealmAlchemica = async (realmId: number): Promise<Alchemicas> => {
  try {
      const result = await alchemicaFacet.getRealmAlchemica(realmId)
      const alchemicas = result.map((el: any) => parseFloat(ethers.utils.formatEther( el )).toFixed(2))
      return {FUD: parseInt(alchemicas[0]), FOMO: parseInt(alchemicas[1]), ALPHA: parseInt(alchemicas[2]), KEK: parseInt(alchemicas[3])}
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getRoundAlchemica
 * @notice Query details about all alchemica gathered in a surveying round in a parcel
 * @param realmId Identifier of the parcel to query
 * @param roundId Identifier of the surveying round to query
 * @return output_ An array representing the numbers of alchemica gathered in a round
 */
export const getRoundAlchemica = async (realmId: number, roundId: number): Promise<Alchemicas> => {
  try {
      const result = await alchemicaFacet.getRoundAlchemica(realmId, roundId)
      const alchemicas = result.map((el: any) => parseFloat(ethers.utils.formatEther( el )).toFixed(2))
      return {FUD: parseInt(alchemicas[0]), FOMO: parseInt(alchemicas[1]), ALPHA: parseInt(alchemicas[2]), KEK: parseInt(alchemicas[3])}
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getRoundBaseAlchemica
 * @notice Query details about the base alchemica gathered in a surveying round in a parcel
 * @param realmId Identifier of the parcel to query
 * @param roundId Identifier of the surveying round to query
 * @return output_ An array representing the numbers of base alchemica gathered in a round
 */
export const getRoundBaseAlchemica = async (realmId: number, roundId: number): Promise<Alchemicas> => {
  try {
      const result = await alchemicaFacet.getRoundBaseAlchemica(realmId, roundId)
      const alchemicas = result.map((el: any) => parseFloat(ethers.utils.formatEther( el )).toFixed(2))
      return {FUD: parseInt(alchemicas[0]), FOMO: parseInt(alchemicas[1]), ALPHA: parseInt(alchemicas[2]), KEK: parseInt(alchemicas[3])}
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getAvailableAlchemica
 * @notice Query the available alchemica in a parcel
 * @param ealmId identifier of parcel to query
 * @return vailableAlchemica An array representing the available quantity of alchemicas currently harvested
 */
export const getAvailableAlchemica = async (realmId: number): Promise<Alchemicas> => {
  try {
      const result = await alchemicaFacet.getAvailableAlchemica(realmId)
      const alchemicas = result.map((el: any) => parseFloat(ethers.utils.formatEther( el )).toFixed(2))
      return {FUD: parseInt(alchemicas[0]), FOMO: parseInt(alchemicas[1]), ALPHA: parseInt(alchemicas[2]), KEK: parseInt(alchemicas[3])}
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name lastClaimedAlchemica
 * @notice The last time reservoirs has been empty
 */
export const lastClaimedAlchemica = async (realmId: number): Promise<Delta> => {
  try {
      const timestamp = await alchemicaFacet.lastClaimedAlchemica(realmId)
      return getDelta(timestamp)
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getHarvestRates
 * @param realmId 
 * @returns The total amounts of alchemicas drain per day
 */
export const getHarvestRates = async(realmId: number): Promise<Alchemicas> => {
  try {
      const result = await alchemicaFacet.getHarvestRates(realmId)
      const harvestRates = result.map((el: any) => parseFloat(ethers.utils.formatEther( el )).toFixed(2))
      return {FUD: parseInt(harvestRates[0]), FOMO: parseInt(harvestRates[1]), ALPHA: parseInt(harvestRates[2]), KEK: parseInt(harvestRates[3])}
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getCapacities
 * @param realmId 
 * @returns The total amount of alchemicas a parcel can hold 
 */
export const getCapacities = async(realmId: number): Promise<Alchemicas> => {
  try {
      const result = await alchemicaFacet.getCapacities(realmId)
      const capacities = result.map((el: any) => parseFloat(ethers.utils.formatEther( el )).toFixed(2))
      return {FUD: parseInt(capacities[0]), FOMO: parseInt(capacities[1]), ALPHA: parseInt(capacities[2]), KEK: parseInt(capacities[3])}
  } catch (error: any) {
      throw new Error(error)
  }
}
// capacities - harvested alchemicas
export const getRemainingCapacities = async(realmId: number): Promise<Alchemicas> => {
  try {
      const capacities = await getCapacities(realmId)
      const harvested  = await getAvailableAlchemica(realmId)
      return {
        FUD:   capacities.FUD - harvested.FUD, 
        FOMO:  capacities.FOMO - harvested.FOMO, 
        ALPHA: capacities.ALPHA - harvested.ALPHA, 
        KEK:   capacities.KEK - harvested.KEK
      }
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getTotalClaimed
 * @param realmId 
 * @returns 
 */
export const getTotalClaimed = async(realmId: number): Promise<Alchemicas> => {
  try {
      const result = await alchemicaFacet.getTotalClaimed(realmId)
      const totalClaimed = result.map((el: any) => parseFloat(ethers.utils.formatEther( el )).toFixed(2))
      return {FUD: parseInt(totalClaimed[0]), FOMO: parseInt(totalClaimed[1]), ALPHA: parseInt(totalClaimed[2]), KEK: parseInt(totalClaimed[3])}
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getLastChanneled
 * @notice Return the last timestamp of a channeling
 * @dev used as a parameter in channelAlchemica
 * @param gotchiId Identifier of parent ERC721 aavegotchi
 * @return last channeling timestamp
 */
export const getLastChanneled = async(gotchiId: number): Promise<Delta> => {
  try {
      const timestamp = await alchemicaFacet.getLastChanneled(gotchiId)
      return getDelta(timestamp.toNumber() * 1000)
  } catch (error: any) {
      throw new Error(error)
  }
}

/**
 * @name getParcelLastChanneled
 * @notice Return the last timestamp of an altar channeling
 * @dev used as a parameter in channelAlchemica
 * @param parcelId Identifier of ERC721 parcel
 * @return last channeling timestamp
 */
export const getParcelLastChanneled = async(parcelId: number): Promise<Delta> => {
  try {
      const timestamp = await alchemicaFacet.getParcelLastChanneled(parcelId)
      return getDelta(timestamp)
  } catch (error: any) {
      throw new Error(error)
  }
}










/***********************************|
|               WRITE               |
|__________________________________*/

/**
 * @name startSurveying
 * Start surveying a realm
 * @param realmId The realm ID to start surveying
 */
export const startSurveying = async (realmId: number) => {
  try {
    console.log(`Starting surveying for realm ID: ${realmId}...`);
    const tx = await alchemicaFacet.startSurveying(realmId, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Surveyed successfully");
  } catch (error) {
    console.error(error);
  }
}

/**
 * @name progressSurveyingRound
 * Progress to the next surveying round
 */
export const progressSurveyingRound = async () => {
  try {
    console.log("Progressing to next surveying round...");
    const tx = await alchemicaFacet.progressSurveyingRound({ gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Surveying round progressed successfully");
  } catch (error) {
    console.error(error);
  }
}

/**
 * @name setVars
 * Set the variables for the smart contract
 * @param alchemicas The array of alchemicas
 * @param boostMultipliers The array of boost multipliers
 * @param greatPortalCapacity The array of great portal capacities
 * @param installationsDiamond The address of the installations diamond
 * @param vrfCoordinator The address of the VRF Coordinator
 * @param linkAddress The address of the link
 * @param alchemicaAddresses The array of alchemica addresses
 * @param gltrAddress The address of the GLTR token
 * @param backendPubKey The backend public key
 * @param gameManager The address of the game manager
 * @param tileDiamond The address of the tile diamond
 * @param aavegotchiDiamond The address of the Aavegotchi diamond
 */
export const setVars = async (
  alchemicas: any[][],
  boostMultipliers: any[],
  greatPortalCapacity: any[],
  installationsDiamond: string,
  vrfCoordinator: string,
  linkAddress: string,
  alchemicaAddresses: any[],
  gltrAddress: string,
  backendPubKey: any,
  gameManager: string,
  tileDiamond: string,
  aavegotchiDiamond: string
) => {
  try {
    console.log("Setting vars...");
    const tx = await alchemicaFacet.setVars(
      alchemicas,
      boostMultipliers,
      greatPortalCapacity,
      installationsDiamond,
      vrfCoordinator,
      linkAddress,
      alchemicaAddresses,
      gltrAddress,
      backendPubKey,
      gameManager,
      tileDiamond,
      aavegotchiDiamond,
      { gasPrice: await getGasPrice() }
    );
    await tx.wait();
    console.log("Vars set successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name setTotalAlchemicas
 * Set the total alchemicas for the smart contract
 * @param otalAlchemicas The array of total alchemicas
 */
export const setTotalAlchemicas = async (otalAlchemicas: number[][]) => {
  try {
    console.log("Setting total alchemicas...");
    const tx = await alchemicaFacet.setTotalAlchemicas(otalAlchemicas, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Total alchemicas set successfully");
  } catch (error: any) {
    console.error(error);
  }
};

/**
 * @name claimAvailableAlchemica
 * Claim available alchemica for a specific realm and Gotchi
 * @param realmId The ID of the realm for which to claim alchemica
 * @param gotchiId The ID of the Gotchi for which to claim alchemica
 * @param signature The signature from the Gotchi owner
 */
export const claimAvailableAlchemica = async (realmId: number, gotchiId: number, signature: string) => {
  try {
    console.log("Claiming available alchemica...");
    const tx = await alchemicaFacet.claimAvailableAlchemica(realmId, gotchiId, signature, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Available alchemica claimed successfully");
  } catch (error: any) {
    console.error(error);
  }
}



/**
 * @name channelAlchemica
 * Channel alchemica to a specific gotchi
 * @param realmId The realm ID where the gotchi is located
 * @param gotchiId The ID of the gotchi to channel the alchemica to
 * @param lastChanneled The last time the gotchi was channeled
 * @param signature The signature of the channeling message
 */
export const channelAlchemica = async (
  realmId: number,
  gotchiId: number,
  lastChanneled: number,
  signature: string
) => {
  try {
    console.log(`Channeling alchemica to gotchi id: ${gotchiId} in realm ${realmId}...`)
    const tx = await alchemicaFacet.channelAlchemica(realmId, gotchiId, lastChanneled, signature, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Alchemica channeled successfully");
  } catch (error: any) {
    console.error(error);
  }
}
// gotchi still need to be logged in
export const quickChannelAlchemica = async (realmId: number, gotchiId: number) => {
  try {
    const lastChanneled = await getLastChanneled(gotchiId)

    const options = {
      headers: {
        "Content-Type": "application/json",
        "User-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        "Origin": "https://verse.aavegotchi.com"
      }
    }
    const data = JSON.stringify({
      parcelId: realmId,
      gotchiId: gotchiId,
      lastChanneled: `${lastChanneled.timestamp}`
    })

    const res = await axios.post("https://api.gotchiverse.io/realm/alchemica/signature/channel/get", data, options)

    if (res.data.signature) {
      const arr: any = Object.values(res.data.signature)
      const sig = SIG_CHANNEL + ethers.utils.hexlify(arr).slice(2)

      console.log("Claiming available alchemica...");
      const tx = await alchemicaFacet.channelAlchemica(realmId, gotchiId, lastChanneled.timestamp, sig, { gasPrice: await getGasPrice() });
      await tx.wait();
      console.log("Available alchemica claimed successfully");
    }
    else
    {
      throw new Error("failed")
    }


  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name batchTransferAlchemica
 * Transfer alchemica to multiple targets
 * @param argets Array of addresses to transfer alchemica to
 * @param mounts Array of alchemica amounts for each target
 */
export const batchTransferAlchemica = async (argets: string[], mounts: number[][]) => {
  try {
    console.log("Transferring alchemica...");
    const tx = await alchemicaFacet.batchTransferAlchemica(argets, mounts, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Alchemica transferred successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * @name batchTransferTokensToGotchis
 * Transfer tokens to multiple gotchis
 * @param gotchiIds Array of gotchi IDs to transfer tokens to
 * @param tokenAddresses Array of token contract addresses to transfer
 * @param amounts Array of token amounts for each gotchi and token
 */
export const batchTransferTokensToGotchis = async (otchiIds: number[], okenAddresses: string[], mounts: number[][]) => {
  try {
    console.log("Transferring tokens to gotchis...");
    const tx = await alchemicaFacet.batchTransferTokensToGotchis(otchiIds, okenAddresses, mounts, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Tokens transferred to gotchis successfully");
  } catch (error: any) {
    console.error(error);
  }
}

/**
* @name setChannelingLimits
* Set the channeling limits for a given altar level
* @param altarLevel The altar level to set the limits for
* @param limits The limits for the altar level
*/
export const setChannelingLimits = async (altarLevel: number[], limits: number[]) => {
  try {
    console.log("Setting channeling limits...");
    const tx = await alchemicaFacet.setChannelingLimits(altarLevel, limits, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Channeling limits set successfully");
  } catch (error) {
    console.error(error);
  }
}

/**
* @name batchTransferTokens
* Batch transfer tokens to multiple recipients
* @param tokens The array of token addresses to transfer
* @param amounts The array of token amounts to transfer
* @param to The array of addresses to transfer the tokens to
*/
export const batchTransferTokens = async (tokens: string[][], amounts: number[][], to: string[]) => {
  try {
    console.log("Batch transferring tokens...");
    const tx = await alchemicaFacet.batchTransferTokens(tokens, amounts, to, { gasPrice: await getGasPrice() });
    await tx.wait();
    console.log("Tokens transferred successfully");
  } catch (error) {
    console.error(error);
  }
}