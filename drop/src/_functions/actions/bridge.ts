import { Db, MongoClient } from "mongodb";
import { Blockchain, RouteAction, TokenPrices } from "../../_models/interfaces";
import { Decimal } from 'decimal.js'
import BlockchainData from '../../_data/input/blockchains_data.json';
import TokenPriceData from '../../_data/input/token_price_data.json';
import { updateBotStatistics } from "../helpers/update_bot_statistics";

export async function bridge(
    routeAction: RouteAction,
    nextBlockchain: string | undefined,
    mongoClient: MongoClient,
    db: Db
): Promise<any> {
    try {
        
        console.log(routeAction);

        const collectionName = "dummywallet";
        const dummyWalletCollection: any = db.collection(collectionName);
        const dummyWalletObj: any = await dummyWalletCollection.findOne({});
        const balances: any = dummyWalletObj?.balances;
        const currentBlockchainsTokensWithBalances: any = balances.filter((balance: any) => balance.blockchain === routeAction.blockchain && balance.gasToken === false && balance.value !== "0");
        let totalAmountToSendToNative = "0";
        let totalValueToSendToNative = "0";
        console.log("nextBlockchain: ", nextBlockchain);

        for(const balance of currentBlockchainsTokensWithBalances) {
            
            const blockchainsData: Blockchain[] = BlockchainData;
            const blockchainsGasToken: string = blockchainsData.filter(blockchain => blockchain.name === routeAction.blockchain)[0].gasToken;

            const tokenPriceData: TokenPrices = TokenPriceData;
            const tokenUsdPrice = tokenPriceData[blockchainsGasToken];

            totalAmountToSendToNative = new Decimal(totalAmountToSendToNative).plus(new Decimal(balance.amount).div(tokenUsdPrice)).toFixed(18);
            totalValueToSendToNative = new Decimal(totalValueToSendToNative).plus(new Decimal(balance.amount)).toFixed(18);

            // Send all to currentBlockchains native token
            await dummyWalletCollection.updateOne(
                { "balances.blockchain": routeAction.blockchain, "balances.gasToken": false },
                { $set: { "balances.$[elem].amount": totalAmountToSendToNative, "balances.$[elem].value": totalValueToSendToNative } },
                { arrayFilters: [{ "elem.blockchain": routeAction.blockchain, "elem.gasToken": false }], multi: true }
            )
            // minus that native balance from current blockchain
            // Add that native balance to the next blockchain

            // await updateBotStatistics(routeAction, db, '0.0000001', '0.0001');

        }
    } catch(e) {
        console.log(e);
    } finally {

        if(mongoClient){
            await mongoClient.close()
        }

    }
}