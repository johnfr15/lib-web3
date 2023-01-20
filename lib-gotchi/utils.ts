import { ethers } from "ethers";
import { PROVIDER } from "./constant";

export const getGasPrice = async(): Promise<ethers.BigNumber> => {

  const gasPrice = await PROVIDER.getGasPrice()
  console.log("gas price in gwei", ethers.utils.formatUnits(gasPrice, "gwei"))

  return gasPrice
} 