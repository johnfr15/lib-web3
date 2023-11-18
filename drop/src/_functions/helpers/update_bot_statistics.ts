//@todo - replace 1970 with actual values from tokenpricedata
//@todo - change the volumes so that it matches the actual coin, not native as is set up for mints, for the swaps and add liquidities to work.
import { Blockchain, RouteAction, TokenPrices } from "../../_models/interfaces";
import BlockchainData from '../../_data/input/blockchains_data.json';
import TokenPriceData from '../../_data/input/token_price_data.json';

import Decimal from 'decimal.js';

const collectionNameBotStatistics = 'botstatistics';

const blockchainsData: Blockchain[] = BlockchainData;
const tokenPriceData: TokenPrices = TokenPriceData;

export async function updateBotStatistics(routeAction: RouteAction, db: any, gasUsed: string, tokenAAmount: string): Promise<void> {

    try {

        const botStatisticsCollection = db.collection(collectionNameBotStatistics);
        const trxType = blockchainsData.filter((blockchain: Blockchain) => blockchain.name === routeAction.blockchain)[0].type;



        //// ------------------------------------------ Update gasUsed ------------------------------------------ \\\\



        // ByBlockchain
        const updateGasUsedByBlockchainAllAmount = "gasUsed.byBlockchain.all.amount";
        const updateGasUsedByBlockchainAllValue = "gasUsed.byBlockchain.all.value";
        const updateGasUsedByBlockchainLegacyAmount = "gasUsed.byBlockchain.legacy.amount";
        const updateGasUsedByBlockchainLegacyValue = "gasUsed.byBlockchain.legacy.value";
        const updateGasUsedByBlockchainAirdropAmount = "gasUsed.byBlockchain.airdrop.amount";
        const updateGasUsedByBlockchainAirdropValue = "gasUsed.byBlockchain.airdrop.value";
        const updateGasUsedByBlockchainNativeAmount = `gasUsed.byBlockchain.${routeAction.blockchain}.amount`;
        const updateGasUsedByBlockchainNativeValue = `gasUsed.byBlockchain.${routeAction.blockchain}.value`;

        // ByProtocol
        const updateGasUsedByProtocolAmount = `gasUsed.byProtocol.${routeAction.protocol}.amount`;
        const updateGasUsedByProtocolValue = `gasUsed.byProtocol.${routeAction.protocol}.value`;

        // ByActionType
        const updateGasUsedByActionTypeAmount = `gasUsed.byActionType.${routeAction.type}.amount`;
        const updateGasUsedByActionTypeValue = `gasUsed.byActionType.${routeAction.type}.value`;

        // Aggregation pipelines to check current balance.
        // ByBlockchain
        const currentGasUsedByBlockchainAllAmountAggregationPipeline = [ { $project: { amount: { $toString: "$gasUsed.byBlockchain.all.amount" } } } ];
        const currentGasUsedByBlockchainAllValueAggregationPipeline = [ { $project: { value: { $toString: "$gasUsed.byBlockchain.all.value" } } } ];
        const currentGasUsedByBlockchainLegacyAmountAggregationPipeline = [ { $project: { amount: { $toString: "$gasUsed.byBlockchain.legacy.amount" } } } ];
        const currentGasUsedByBlockchainLegacyValueAggregationPipeline = [ { $project: { value: { $toString: "$gasUsed.byBlockchain.legacy.value" } } } ];
        const currentGasUsedByBlockchainAirdropAmountAggregationPipeline = [ { $project: { amount: { $toString: "$gasUsed.byBlockchain.airdrop.amount" } } } ];
        const currentGasUsedByBlockchainAirdropValueAggregationPipeline = [ { $project: { value: { $toString: "$gasUsed.byBlockchain.airdrop.value" } } } ];
        const currentGasUsedByBlockchainNativeAmountAggregationPipeline = [ { $project: { amount: { $toString: `$gasUsed.byBlockchain.${routeAction.blockchain}.amount` } } } ];
        const currentGasUsedByBlockchainNativeValueAggregationPipeline = [ { $project: { value: { $toString: `$gasUsed.byBlockchain.${routeAction.blockchain}.value` } } } ];

        // ByProtocol
        const currentGasUsedByProtocolAmountAggregationPipeline = [ { $project: { amount: { $toString: `$gasUsed.byProtocol.${routeAction.protocol}.amount` } } } ];
        const currentGasUsedByProtocolValueAggregationPipeline = [ { $project: { value: { $toString: `$gasUsed.byProtocol.${routeAction.protocol}.value` } } } ];
    
        // ByActionType
        const currentGasUsedByActionTypeAmountAggregationPipeline = [ { $project: { amount: { $toString: `$gasUsed.byActionType.${routeAction.type}.amount` } } } ];
        const currentGasUsedByActionTypeValueAggregationPipeline = [ { $project: { value: { $toString: `$gasUsed.byActionType.${routeAction.type}.value` } } } ];
    
        // Current Gas Stats array
        // ByBlockchain
        const currentGasUsedByBlockchainAllAmount = await botStatisticsCollection.aggregate(currentGasUsedByBlockchainAllAmountAggregationPipeline).toArray();
        const currentGasUsedByBlockchainAllValue = await botStatisticsCollection.aggregate(currentGasUsedByBlockchainAllValueAggregationPipeline).toArray();
        const currentGasUsedByBlockchainLegacyAmount = await botStatisticsCollection.aggregate(currentGasUsedByBlockchainLegacyAmountAggregationPipeline).toArray();
        const currentGasUsedByBlockchainLegacyValue = await botStatisticsCollection.aggregate(currentGasUsedByBlockchainLegacyValueAggregationPipeline).toArray();
        const currentGasUsedByBlockchainAirdropAmount = await botStatisticsCollection.aggregate(currentGasUsedByBlockchainAirdropAmountAggregationPipeline).toArray();
        const currentGasUsedByBlockchainAirdropValue = await botStatisticsCollection.aggregate(currentGasUsedByBlockchainAirdropValueAggregationPipeline).toArray();
        const currentGasUsedByBlockchainNativeAmount = await botStatisticsCollection.aggregate(currentGasUsedByBlockchainNativeAmountAggregationPipeline).toArray();
        const currentGasUsedByBlockchainNativeValue = await botStatisticsCollection.aggregate(currentGasUsedByBlockchainNativeValueAggregationPipeline).toArray();

        // ByProtocol
        const currentGasUsedByProtocolAmount = await botStatisticsCollection.aggregate(currentGasUsedByProtocolAmountAggregationPipeline).toArray();
        const currentGasUsedByProtocolValue = await botStatisticsCollection.aggregate(currentGasUsedByProtocolValueAggregationPipeline).toArray();

        // ByActionType
        const currentGasUsedByActionTypeAmount = await botStatisticsCollection.aggregate(currentGasUsedByActionTypeAmountAggregationPipeline).toArray();
        const currentGasUsedByActionTypeValue = await botStatisticsCollection.aggregate(currentGasUsedByActionTypeValueAggregationPipeline).toArray();
        
        // Current Gas Amounts and Values
        // ByBlockchain
        const gasAmountByBlockchainAll = currentGasUsedByBlockchainAllAmount[0].amount;
        const gasValueByBlockchainAll = currentGasUsedByBlockchainAllValue[0].value;
        const gasAmountByBlockchainLegacy = currentGasUsedByBlockchainLegacyAmount[0].amount;
        const gasValueByBlockchainLegacy = currentGasUsedByBlockchainLegacyValue[0].value;
        const gasAmountByBlockchainAirdrop = currentGasUsedByBlockchainAirdropAmount[0].amount;
        const gasValueByBlockchainAirdrop = currentGasUsedByBlockchainAirdropValue[0].value;
        const gasAmountByBlockchainNative = currentGasUsedByBlockchainNativeAmount[0].amount;
        const gasValueByBlockchainNative = currentGasUsedByBlockchainNativeValue[0].value;

        // ByProtocol
        const gasUsedByProtocolAmount = currentGasUsedByProtocolAmount[0].amount;
        const gasUsedByProtocolValue = currentGasUsedByProtocolValue[0].value;
    
        // ByActionType
        const gasUsedByActionTypeAmount = currentGasUsedByActionTypeAmount[0].amount;
        const gasUsedByActionTypeValue = currentGasUsedByActionTypeValue[0].value;
    
        // New used gas amounts
        // ByBlockchain
        const blockchainsGasToken = blockchainsData.filter(blockchain => blockchain.name === routeAction.blockchain)[0].gasToken;
        const tokenUsdPrice = tokenPriceData[blockchainsGasToken];

        const newGasUsedByBlockchainAllAmount = new Decimal(gasAmountByBlockchainAll).plus(new Decimal(gasUsed)).toFixed(18);
        const newGasUsedByBlockchainAllValue = new Decimal(gasValueByBlockchainAll).plus((new Decimal(gasUsed)).div(tokenUsdPrice)).toFixed(18); // replace with real native token value and decimals
        const newGasUsedByBlockchainLegacyAmount = new Decimal(gasAmountByBlockchainLegacy).plus(new Decimal(gasUsed)).toFixed(18);
        const newGasUsedByBlockchainLegacyValue = new Decimal(gasValueByBlockchainLegacy).plus((new Decimal(gasUsed)).div(tokenUsdPrice)).toFixed(18); // replace with real native token value and decimals
        const newGasUsedByBlockchainAirdropAmount = new Decimal(gasAmountByBlockchainAirdrop).plus(new Decimal(gasUsed)).toFixed(18);
        const newGasUsedByBlockchainAirdropValue = new Decimal(gasValueByBlockchainAirdrop).plus((new Decimal(gasUsed)).div(tokenUsdPrice)).toFixed(18); // replace with real native token value and decimals
        const newGasUsedByBlockchainNativeAmount = new Decimal(gasAmountByBlockchainNative).plus(new Decimal(gasUsed)).toFixed(18);
        const newGasUsedByBlockchainNativeValue = new Decimal(gasValueByBlockchainNative).plus((new Decimal(gasUsed)).div(tokenUsdPrice)).toFixed(18); // replace with real native token value and decimals

        // ByProtocol
        const newGasUsedByProtocolAmount = new Decimal(gasUsedByProtocolAmount).plus(new Decimal(gasUsed)).toFixed(18);
        const newGasUsedByProtocolValue = new Decimal(gasUsedByProtocolValue).plus((new Decimal(gasUsed)).div(tokenUsdPrice)).toFixed(18); // replace with real native token value and decimals

        // ByActionType
        const newGasUsedByActionTypeAmount = new Decimal(gasUsedByActionTypeAmount).plus(new Decimal(gasUsed)).toFixed(18);
        const newGasUsedByActionTypeValue = new Decimal(gasUsedByActionTypeValue).plus((new Decimal(gasUsed)).div(tokenUsdPrice)).toFixed(18); // replace with real native token value and decimals
        
        // Update gasUsed amounts and values
        // ByBlockchain All
        await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByBlockchainAllAmount]: newGasUsedByBlockchainAllAmount } });
        await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByBlockchainAllValue]: newGasUsedByBlockchainAllValue } });

        // ByBlockchain - Legacy and Airdrop
        if(trxType === 'legacy') {
            
            await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByBlockchainLegacyAmount]: newGasUsedByBlockchainLegacyAmount } });
            await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByBlockchainLegacyValue]: newGasUsedByBlockchainLegacyValue } });
        
        } else if(trxType === 'airdrop'){
            
            await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByBlockchainAirdropAmount]: newGasUsedByBlockchainAirdropAmount } });
            await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByBlockchainAirdropValue]: newGasUsedByBlockchainAirdropValue } });

        }

        // ByBlockchain - native
        await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByBlockchainNativeAmount]: newGasUsedByBlockchainNativeAmount } });
        await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByBlockchainNativeValue]: newGasUsedByBlockchainNativeValue } });

        // ByProtocol
        await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByProtocolAmount]: newGasUsedByProtocolAmount } });
        await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByProtocolValue]: newGasUsedByProtocolValue } });

        // ByActionType
        await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByActionTypeAmount]: newGasUsedByActionTypeAmount } });
        await botStatisticsCollection.updateOne({}, { $set: { [updateGasUsedByActionTypeValue]: newGasUsedByActionTypeValue } });



        //// ------------------------------------------ Update TrxCounts ------------------------------------------ \\\\



        // ByBlockchain - All
        const updateTrxCountsForAllBlockchains = `trxCounts.byBlockchain.all`
        await botStatisticsCollection.updateOne({}, { $inc: { [updateTrxCountsForAllBlockchains]: 1 } });
        
        // ByBlockchain - Legacy or Airdrop?
        if(trxType === 'legacy') {

            const updateTrxCountsForLegacyBlockchains = `trxCounts.byBlockchain.legacy`;
            await botStatisticsCollection.updateOne({}, { $inc: { [updateTrxCountsForLegacyBlockchains]: 1 } });
        
        } else if(trxType === 'airdrop'){

            const updateTrxCountsForAirdropBlockchains = `trxCounts.byBlockchain.airdrop`;
            await botStatisticsCollection.updateOne({}, { $inc: { [updateTrxCountsForAirdropBlockchains]: 1 } });

        }
    
        // ByBlockchains
        const updateTrxCountsByBlockchain = `trxCounts.byBlockchain.${routeAction.blockchain}`;
        await botStatisticsCollection.updateOne({}, { $inc: { [updateTrxCountsByBlockchain]: 1 } });

        // ByProtocol
        const updateTrxCountsByProtocol = `trxCounts.byProtocol.${routeAction.protocol}`;
        await botStatisticsCollection.updateOne({}, { $inc: { [updateTrxCountsByProtocol]: 1 } });

        // ByActionType
        const updateTrxCountsByActionType = `trxCounts.byActionType.${routeAction.type}`;
        await botStatisticsCollection.updateOne({}, { $inc: { [updateTrxCountsByActionType]: 1 } })



        //// ------------------------------------------ Update trxVolumes ------------------------------------------ \\\\



        // ByBlockchain
        const updateTrxVolumeByBlockchainAll = "trxVolume.byBlockchain.all";
        const updateTrxVolumeByBlockchainLegacy = `trxVolume.byBlockchain.legacy`;
        const updateTrxVolumeByBlockchainAirdrop = "trxVolume.byBlockchain.airdrop";
        const updateTrxVolumeByBlockchains = `trxVolume.byBlockchain.${routeAction.blockchain}`;

        const currentTrxVolumeByBlockchainAllAggregationPipeline = [ { $project: { _id: 0, all: "$trxVolume.byBlockchain.all" } } ];
        const currentTrxVolumeByBlockchainLegacyAggregationPipeline = [ { $project: { _id: 0, legacy: "$trxVolume.byBlockchain.legacy" } } ];
        const currentTrxVolumeByBlockchainAirdropAggregationPipeline = [ { $project: { _id: 0, airdrop: "$trxVolume.byBlockchain.airdrop" } } ];
        const currentTrxVolumeByBlockchainsAggregationPipeline = [ { $project: { _id: 0, blockchain: `$trxVolume.byBlockchain.${routeAction.blockchain}` } } ];
        
        const currentTrxVolumeByBlockchainAll = await botStatisticsCollection.aggregate(currentTrxVolumeByBlockchainAllAggregationPipeline).toArray();
        const currentTrxVolumeByBlockchainLegacy = await botStatisticsCollection.aggregate(currentTrxVolumeByBlockchainLegacyAggregationPipeline).toArray();
        const currentTrxVolumeByBlockchainAirdrop = await botStatisticsCollection.aggregate(currentTrxVolumeByBlockchainAirdropAggregationPipeline).toArray();
        const currentTrxVolumeByBlockchains = await botStatisticsCollection.aggregate(currentTrxVolumeByBlockchainsAggregationPipeline).toArray();

        const trxVolumeByBlockchainAll = (currentTrxVolumeByBlockchainAll[0]).all;
        const trxVolumeByBlockchainLegacy = (currentTrxVolumeByBlockchainLegacy[0]).legacy;
        const trxVolumeByBlockchainAirdrop = (currentTrxVolumeByBlockchainAirdrop[0]).airdrop;
        const trxVolumeByBlockchains = (currentTrxVolumeByBlockchains[0]).blockchain;

        const newTrxVolumeByBlockchainAll = new Decimal(trxVolumeByBlockchainAll).plus(new Decimal(tokenAAmount).div(tokenUsdPrice)).toFixed(18);
        const newTrxVolumeByBlockchainLegacy = new Decimal(trxVolumeByBlockchainLegacy).plus(new Decimal(tokenAAmount).div(tokenUsdPrice)).toFixed(18);
        const newTrxVolumeByBlockchainAirdrop = new Decimal(trxVolumeByBlockchainAirdrop).plus(new Decimal(tokenAAmount).div(tokenUsdPrice)).toFixed(18);
        const newTrxVolumeByBlockchains = new Decimal(trxVolumeByBlockchains).plus(new Decimal(tokenAAmount).div(tokenUsdPrice)).toFixed(18);

        await botStatisticsCollection.updateOne({}, { $set: { [updateTrxVolumeByBlockchainAll]: newTrxVolumeByBlockchainAll } });
        await botStatisticsCollection.updateOne({}, { $set: { [updateTrxVolumeByBlockchainLegacy]: newTrxVolumeByBlockchainLegacy } });
        await botStatisticsCollection.updateOne({}, { $set: { [updateTrxVolumeByBlockchainAirdrop]: newTrxVolumeByBlockchainAirdrop } });
        await botStatisticsCollection.updateOne({}, { $set: { [updateTrxVolumeByBlockchains]: newTrxVolumeByBlockchains } });

        // ByProtocol
        const updateTrxVolumeByProtocol = `trxVolume.byProtocol.${routeAction.protocol}`;
        const currentTrxVolumeByProtocolAggregationPipeline = [ { $project: { _id: 0, protocol: `$trxVolume.byProtocol.${routeAction.protocol}` } } ];
        const currentTrxVolumeByProtocol = await botStatisticsCollection.aggregate(currentTrxVolumeByProtocolAggregationPipeline).toArray();
        const trxVolumeByProtocol = (currentTrxVolumeByProtocol[0]).protocol;
        const newTrxVolumeByProtocol = new Decimal(trxVolumeByProtocol).plus(new Decimal(tokenAAmount).div(tokenUsdPrice)).toFixed(18);
        await botStatisticsCollection.updateOne({}, { $set: { [updateTrxVolumeByProtocol]: newTrxVolumeByProtocol } });

        // ByActionType
        const updateTrxVolumeByActionType = `trxVolume.byActionType.${routeAction.type}`;
        const currentTrxVolumeByActionTypeAggregationPipeline = [ { $project: { _id: 0, actionType: `$trxVolume.byActionType.${routeAction.type}` } } ];
        const currentTrxVolumeByActionType = await botStatisticsCollection.aggregate(currentTrxVolumeByActionTypeAggregationPipeline).toArray();
        const trxVolumeByActionType = (currentTrxVolumeByActionType[0]).actionType;
        const newTrxVolumeByActionType = new Decimal(trxVolumeByActionType).plus(new Decimal(tokenAAmount).div(tokenUsdPrice)).toFixed(18);
        await botStatisticsCollection.updateOne({}, { $set: { [updateTrxVolumeByActionType]: newTrxVolumeByActionType } });


        return;
    } catch(e) {
        console.log("error in updateBotStatistics!")
    } finally {
        // console.log("updates finished or errored")
    }

}