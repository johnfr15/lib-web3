import * as Aavegotchifacet from "../lib-gotchi/aavegotchi/aavegotchiFacet";
import * as AavegotchiGamefacet from "../lib-gotchi/aavegotchi/aavegotchiGameFacet";
import * as CollateralFacet from "../lib-gotchi/aavegotchi/collateralFacet"
import * as ERC721MarketPlaceFacet from "../lib-gotchi/aavegotchi/erc721MarketplaceFacet"
import * as ERC1155MarketPlaceFacet from "../lib-gotchi/aavegotchi/erc1155MarketplaceFacet"
import { writeFile } from "fs/promises";
import { SIGNER, PROVIDER, VAULT_ADRESS, AAVEGOTCHI_DIAMOND_ADDRES } from "../lib-gotchi/constant";
import { ethers } from "ethers";

const main = async() => {
  console.log("signer: ", SIGNER.address)
  console.log("balance: ", ethers.utils.formatEther( await PROVIDER.getBalance(SIGNER.address) ), " MATIC\n")

  try {
    // console.log(await Aavegotchifacet.batchOwnerOf([317, 1421, 23, 134, 12654]))
    // console.log( await AavegotchiGamefacet.ghstAddress() )
    // console.log( await CollateralFacet.getAllCollateralTypes() )
    // console.log( await ERC721MarketPlaceFacet.getERC721Listing(100) )
    console.log( await ERC1155MarketPlaceFacet.getERC1155Listing(100) )
  } catch (error) {
    console.log(error)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});