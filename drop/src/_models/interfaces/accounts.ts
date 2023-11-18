export interface AmountValue {
    amount: number;
    value: number;
}

export interface Balance {
    amount: string,
    blockchain: string,
    gasToken: boolean,
    symbol: string,
    value: string
}


export interface GasInfo {
    amount: string;
    value: string;
}

export interface BotStatistics {
    gasUsed: {
        byBlockchain: {
            [blockchain: string]: GasInfo
        };
        byProtocol: {
            [blockchain: string]: GasInfo
        };
        byActionType: {
            [blockchain: string]: GasInfo
        };
    };
    trxCounts: {
        byBlockchain: Record<string, number>;
        byProtocol: Record<string, number>;
        byActionType: Record<string, number>;
    },
    trxVolume: {
        byBlockchain: Record<string, string>;
        byProtocol: Record<string, string>;
        byActionType: Record<string, string>;
    }
}

export interface Signer {
    publicKey: string;
    privateKey: string;
}

export interface TokenInfo {
    balance: number;
    gasToken: boolean;
    name: string;
    symbol: string;
}
    
export interface Token {
    name: string;
    amount: number;
    value: number;
};

export interface DummyWallet {
    balances: Balance[];
    signer: Signer;
}

export interface StarknetAccount {
    MAINNET_PROVIDER: string;
    TEST_STARK_PUBLIC_KEY: string;
    TEST_STARK_PRIVATE_KEY: string;
}

    interface Fruit {
    name: 'apple' | 'orange' | 'banana';
    // Other properties if needed
  }