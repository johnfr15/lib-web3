import { ethers } from "ethers"
import dotenv from "dotenv";

dotenv.config()

// Anon's Stuff
export const PROVIDER = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
export const SIGNER = new ethers.Wallet(process.env.PRIVATE_KEY!, PROVIDER);
export const MY_GOTCHIS = [46, 272, 317, 726, 903, 3122, 4034, 4358, 5631, 6198, 6462, 7497, 9281, 9383, 12475, 13713, 15718, 18149, 19336, 20706, 23730]

// Contract address
export const CONTRACT = {
  aavegotchi: {
    aavegotchi: "0x86935F11C86623deC8a25696E1C19a8659CbF95d",
    wearable: "0x58de9AaBCaeEC0f69883C94318810ad79Cc6a44f",
    realm: "0x1D0360BaC7299C86Ec8E99d0c1C9A95FEfaF2a11",
    installation: "0x19f870bD94A34b3adAa9CaA439d333DA18d6812A",
    tile: "0x9216c31d8146bCB3eA5a9162Dc1702e8AEDCa355",
    fake_card: "0x9f6BcC63e86D44c46e85564E9383E650dc0b56D7",
    fake_nft: "0xA4E3513c98b30d4D7cc578d2C328Bd550725D1D0",
  },
  vault: "0xDd564df884Fd4e217c9ee6F65B4BA6e5641eAC63",
}

// Token address
export const TOKENS = {
  ghst:   "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7",
  fud:    "0x403E967b044d4Be25170310157cB1A4Bf10bdD0f",
  fomo:   "0x44A6e0BE76e1D9620A7F76588e4509fE4fa8E8C8",
  alpha:  "0x6a3E7C3c6EF65Ee26975b12293cA1AAD7e1dAeD2",
  kek:    "0x42E5E06EF5b90Fe15F853F59299Fc96259209c5C",
  dai:    "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
}


export const SIG_CHANNEL = "0x00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000041"

export const SPLIT: {[key: string]: string} = {
  "0x403E967b044d4Be25170310157cB1A4Bf10bdD0f": "FUD",
  "0x44A6e0BE76e1D9620A7F76588e4509fE4fa8E8C8": "FOMO",
  "0x6a3E7C3c6EF65Ee26975b12293cA1AAD7e1dAeD2": "ALPHA",
  "0x42E5E06EF5b90Fe15F853F59299Fc96259209c5C": "KEK",
}

// Token price
export const FUD_PRICE    = 0.0016
export const FOMO_PRICE   = 0.018
export const ALPHA_PRICE  = 0.0065
export const KEK_PRICE    = 0.0164
export const GHST_PRICE   = 1.02
export const MATIC_PRICE  = 0.997

// ARPC = Alchemica received per channeling
export const ARPC = {
  fud: 20,
  fomo: 10,
  alpha: 5,
  kek: 2
}

export const AALTAR_SPILLOVER = [1, 0.5, 0.45, 0.45, 0.35, 0.30, 0.25, 0.20, 0.15, 0.10]