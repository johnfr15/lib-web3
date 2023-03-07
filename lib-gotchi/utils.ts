import { ethers } from "ethers";
import { alchemicaFacet } from "./realm/alchemicaFacet";
import { ALPHA_PRICE, FOMO_PRICE, FUD_PRICE, KEK_PRICE,PROVIDER, AALTAR_SPILLOVER, GHST_PRICE, SIGNER, MATIC_PRICE, ARPC, CONTRACT } from "./constant";


export const getGasPrice = async(): Promise<ethers.BigNumber> => {

  const gasPrice = await PROVIDER.getGasPrice()
  console.log("gas price in gwei", ethers.utils.formatUnits(gasPrice, "gwei"))

  return gasPrice
}

export const hoursPassed = (timestamp: number): number => {
  let blockDate = new Date(timestamp * 1000);
  let currentDate = new Date();
  let diff = currentDate.getTime() - blockDate.getTime();
  let hoursPassed = Math.floor(diff / (1000 * 60 * 60));
  return hoursPassed;
}

// Give delta in Days/Hours/Minutes/Seconds 
export const getDelta = (timestamp: number): {days: number, hours: number, minutes: number, seconds: number, timestamp: number} => {
  let blockDate = new Date(timestamp);
  let currentDate = new Date();
  let diff = currentDate.getTime() - blockDate.getTime();

  let daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff = diff % (1000 * 60 * 60 * 24);
  let hoursPassed = Math.floor(diff / (1000 * 60 * 60));
  diff = diff % (1000 * 60 * 60);
  let minutesPassed = Math.floor(diff / (1000 * 60));
  diff = diff % (1000 * 60);
  let secondsPassed = Math.floor(diff / 1000);

  return {days: daysPassed, hours: hoursPassed, minutes: minutesPassed, seconds: secondsPassed, timestamp: timestamp}
}

export const serializeSig = (signature: Object) => {
  let arr: any = Object.values(signature)
  console.log("Sig array: ", arr)
  console.log("length: ", arr.length)

  // hexlify
  arr = ethers.utils.hexlify(arr)
  console.log(arr)
  //strip
  arr = ethers.utils.stripZeros(arr)
  console.log(arr)
}

export const getGasCostOfFunc = async(contractAddress: string, abi: string, functionName: string, params: any[]): Promise<number> => {
  try {
    const contract = new ethers.Contract( CONTRACT.aavegotchi.aavegotchi, [abi], SIGNER)
    const gasCost = await contract.estimateGas[functionName](...params);
  
    let gasPrice: ethers.BigNumber | number = await PROVIDER.getGasPrice()
    gasPrice.mul(2)

    let totalCost: any = gasPrice.mul(gasCost)
    totalCost = parseFloat(ethers.utils.formatEther(totalCost))
    totalCost *= MATIC_PRICE

    return totalCost
  } catch (error: any) {
    throw new Error(error)
  }
}

// Get how much time is needed to be tomorrow 00H00 UTC
export const getTomorrowInterval = (): number => {
  const current = new Date()
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.getTime() - current.getTime();
}

export const getTime = (timestamp: number) => {
  let time = timestamp

  let days = Math.floor(time / (1000 * 60 * 60 * 24));
  time = time % (1000 * 60 * 60 * 24);
  let hours = Math.floor(time / (1000 * 60 * 60));
  time = time % (1000 * 60 * 60);
  let minutes = Math.floor(time / (1000 * 60));
  time = time % (1000 * 60);
  let seconds = Math.floor(time / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

export const calc_channeling_revenue = (kinship: number, initialCost: number, borrowSplit: number, funcCost: number, altarLevel: number = 9): number => {
  let total = 0

  const modifier = Math.sqrt(kinship / 50)
  const lendingCost = initialCost * GHST_PRICE

  total += (ARPC.fud   * modifier) * FUD_PRICE
  total += (ARPC.fomo  * modifier) * FOMO_PRICE
  total += (ARPC.alpha * modifier) * ALPHA_PRICE
  total += (ARPC.kek   * modifier) * KEK_PRICE

  total *= 1 - AALTAR_SPILLOVER[altarLevel]
  total *= (borrowSplit / 100)
  total - lendingCost - funcCost

  return parseFloat(total.toFixed(2))
}

export const isChannable = async(gotchiId: number, listingPeriod: number): Promise<{state: boolean, when: string}> => {

  // is Channable today ?
  const lastChanneled =  await alchemicaFacet.getLastChanneled(gotchiId)
  const currentTimestamp = new Date().getTime();
  const nineHourTimestamp = new Date(currentTimestamp).setHours(9,0,0,0);

  const delta = nineHourTimestamp - (lastChanneled.timestamp * 1000)

  if (delta > 0)
    return {state: true, when: "today"}

  // is channable tomorrow ?
  else
  {
    let lendingTime = listingPeriod * 1000
    let hours = 0

    const intervalTommorrow = getTomorrowInterval()
    const intervalLending = lendingTime - intervalTommorrow

    if (intervalLending > 0)
      hours = Math.floor(intervalLending / (1000 * 60 * 60));

    // check if lending interval is at least 1H if not we don't accept lending
    if (hours >= 1)
      return {state: true, when: "tommorrow"}
    else
      return {state: false, when: ""}
  }
}