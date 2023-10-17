import { AddressLike } from "ethers"
import { Token } from "../types"

// start
export type StartRoute = {
    fromChainId: number,
    toChainId: number,
    fromAssetAddress: AddressLike,
    toAssetAddress: AddressLike,
    includeFirstTxDetails: boolean,
    route: {
      routeId: string,
      isOnlySwapRoute: boolean,
      fromAmount: bigint,
      chainGasBalances: {},
      minimumGasBalances: {},
      toAmount: bigint,
      usedBridgeNames: string[],
      totalUserTx: number,
      totalGasFeesInUsd: number,
      recipient: AddressLike,
      sender: AddressLike,
      userTxs: Array<Object>
      receivedValueInUsd: number,
      inputValueInUsd: number,
      outputValueInUsd: number,
      serviceTime: number,
      maxServiceTime: number,
      integratorFee: {
        feeTakerAddress: string,
        amount: string,
        asset: Token
      },
      t2bReceiverAddress: AddressLike,
      extraData: {}
    },
    refuel: {
      fromAmount: string,
      toAmount: string,
      gasFees: {
        gasLimit: number,
        feesInUsd: number,
        asset: Token,
        gasAmount: string
      },
      recipient: AddressLike,
      serviceTime: number,
      fromAsset: Token,
      toAsset: Token,
      fromChainId: number,
      toChainId: number
    },
    destinationCallData: {
      destinationPayload: string,
      destinationGasLimit: string
    },
    bridgeInsuranceData: {
      amount: string
    }
}

export type Route = {
    userTxType: string,
    txTarget: string,
    chainId: string,
    activeRouteId: 0,
    txData: string,
    txType: string,
    value: string,
    userTxIndex: bigint,
    totalUserTx: bigint,
    approvalData: {
        minimumApprovalAmount: bigint,
        approvalTokenAddress: AddressLike,
        allowanceTarget: AddressLike,
        owner: AddressLike
    }
}

// active-routes
export type ActiveRoute = {
    activeRouteId: number,
    userAddress: AddressLike,
    totalUserTx: number,
    userTxs: Array<Object>,
    fromChainId: number,
    toChainId: number,
    fromAssetAddress: AddressLike,
    toAssetAddress: AddressLike,
    fromAmount: bigint,
    toAmount: bigint,
    routeStatus: string,
    createdAt: number,
    updatedAt: number,
    currentUserTxIndex: number,
    fromAsset: Token,
    toAsset: Token
}

// build-next-tx
export type BuildNextTxOptions = {
    // This will override the existing recipient if specified for the tx. !!If overridden the recipient will be change in the Database too.
    newRecipient?: AddressLike
    // bridgeSlippage between 0 - 100. Overrides the default bridge slippage in the route. NOTE - Slippage is not present for all bridges.
    bridgeSlippage?: number
    // swapSlippage between 0 - 100. Overrides the default swap slippage in the route.
    swapSlippage?: number
}

// prepare
export type PrepareOptions = {
    // Transaction hash that relates to the userTxIndex. Each object in the userTxs is a transaction that has to be done by the user to progress in the route. If all the transactions are completed in the route, it will be marked complete.
    txHash?: string
    // Signature to be sent in case the next transaction is dependant on the signature.
    signature?: string
}