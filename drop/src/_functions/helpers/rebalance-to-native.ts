import BlockchainData from '../../_data/input/blockchains_data.json';
import DummyWalletData from '../../_data/input/dummy_wallet_data_native_rebalance.json';
import { DummyWallet } from '../../_models/interfaces';

const dummyWallet = DummyWalletData;// @todo - remove and send in from other module.

export async function rebalanceToNative(blockchainName: string, walletData: DummyWallet): Promise<any> {

    //Blockchain data
    const blockchainData = BlockchainData;
    const selectedBlockchain = blockchainData.filter(blockchain => blockchain.name === blockchainName)[0]; // @todo - replace filter with something that just returns and object.
    const gasToken = selectedBlockchain.gasToken;

    // Wallet data
    const walletBlockchain = dummyWallet.balances.filter(blockchain => blockchain.blockchainName === blockchainName)[0];
    const walletTokens = walletBlockchain.tokens;
    console.log("walletTokens: ", walletTokens);

    for(const token of walletTokens){
        if(token.name === gasToken){
            console.log("don't do anything as this is native")
        } else if(token.value > 0) {
            const value = token.value;
            // Minus from non-native
            token.amount -= value;
            token.value -= value; // @todo - make this -= or =- whatever it is, no wiif.

            // Add to native

            updateNativeWalletBlockchain.amount += value;
            updateNativeWalletBlockchain.value += value;
        }
    }

    return walletData;
}

// rebalanceToNative('arbitrum', dummyWallet).then(x => console.log("x: ", x)).catch(e => console.log(e));
rebalanceToNative('arbitrum', dummyWallet).then(x => x).catch(e => console.log(e));