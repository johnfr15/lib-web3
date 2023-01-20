import * as Aavegotchifacet from "../lib-gotchi/aavegotchi/aavegotchiFacet";
import * as AavegotchiGamefacet from "../lib-gotchi/aavegotchi/aavegotchiGameFacet";
import * as CollateralFacet from "../lib-gotchi/aavegotchi/collateralFacet"
import { writeFile } from "fs/promises";
import { SIGNER, PROVIDER, VAULT_ADRESS } from "../lib-gotchi/constant";
import { ethers } from "ethers";

const main = async() => {
  console.log("signer: ", SIGNER.address)
  console.log("balance: ", ethers.utils.formatEther( await PROVIDER.getBalance(SIGNER.address) ), " MATIC\n")

  try {
    // console.log(await Aavegotchifacet.batchOwnerOf([317, 1421, 23, 134, 12654]))
    // console.log( await AavegotchiGamefacet.xpUntilNextLevel(490999) )
    console.log( await CollateralFacet.collaterals(1) )
  } catch (error) {
    console.log(error)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});