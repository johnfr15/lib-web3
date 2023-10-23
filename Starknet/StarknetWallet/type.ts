import { AddressLike } from "ethers"

export type Account = {
    type: string,
    version: string,
    generation: string,
    classHash: string,
    starkKeyPriv: string,
    starkKeyPub: string,
    constructor: any
    accountAddress: string,
}

export type HDNode = {
    address: AddressLike,
    privateKey: string,
    publicKey: string,
    fingerprint: string,
    parentFingerprint: string,
    mnemonic: {
      phrase: string,
      password: string,
      wordlist: string,
      entropy: string
    },
    chainCode: string,
    path: string,
    pathIndex: number,
    depth: number
}

export type AccountType = "braavos"