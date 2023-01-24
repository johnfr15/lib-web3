import * as Aavegotchifacet from "../lib-gotchi/aavegotchi/aavegotchiFacet";
import * as AavegotchiGameFacet from "../lib-gotchi/aavegotchi/aavegotchiGameFacet";
import * as CollateralFacet from "../lib-gotchi/aavegotchi/collateralFacet"
import * as ERC721MarketPlaceFacet from "../lib-gotchi/aavegotchi/erc721MarketplaceFacet"
import * as ERC1155MarketPlaceFacet from "../lib-gotchi/aavegotchi/erc1155MarketplaceFacet"
import * as EscrowFacet from "../lib-gotchi/aavegotchi/escrowFacet"
import * as AlchemicaFacet from "../lib-gotchi/realm/alchemicaFacet"
import * as Utils from "../lib-gotchi/utils"
import * as UtilsEvent from "../events-gotchi/utils"

import * as GotchiLendingEvent from "../events-gotchi/aavegotchi/gotchiLendingFacet"

import { writeFile } from "fs/promises";
import { SIGNER, PROVIDER, VAULT_ADRESS, AAVEGOTCHI_DIAMOND_ADDRES, GHST_ADDRESS } from "../lib-gotchi/constant";
import { ethers } from "ethers";


const main = async() => {
  console.log("signer: ", SIGNER.address)
  console.log("balance: ", ethers.utils.formatEther( await PROVIDER.getBalance(SIGNER.address) ), " MATIC\n")

  try {
    // events
    // GotchiLendingEvent.listenGotchiLendingAdded()



    //utils
    // Utils.quickClaimAlchemica(24207, 7497)
    // console.log(UtilsEvent.getTime(UtilsEvent.getTomorrowInterval()))


    // aavegotchi diamond
    // console.log(await Aavegotchifacet.getAavegotchi(23067))
    console.log( await AavegotchiGameFacet.petAllGotchiOfOwner("0xd4e42e41FCa01464d36a44ACAb98D2aA1447e8f4") )
    // console.log( await CollateralFacet.getAllCollateralTypes() )
    // console.log( await ERC721MarketPlaceFacet.getERC721Listing(100) )
    // console.log( await ERC1155MarketPlaceFacet.getERC1155Listing(100) )
    // console.log( await EscrowFacet.gotchiEscrow(317) )
    
    // realm diamond


    // console.log( await AlchemicaFacet.quickClaimAlchemica(2762, 7497) ) // 2762

    // ghst 
    // const contract = new ethers.Contract(GHST_ADDRESS, ["function approve(address spender, uint256 amount) public virtual override returns (bool)"], SIGNER)
    // const tx = await contract.approve(AAVEGOTCHI_DIAMOND_ADDRES, ethers.utils.parseEther("5"), {gasPrice: await Utils.getGasPrice()})
    // await tx.wait()
  } catch (error) {
    console.log(error)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});