import mongoose from 'mongoose';

// Define a schema for tokens
const tokenSchema = new mongoose.Schema({
  name: String,
  amount: String,
  value: String,
});

// Define a schema for blockchain balances
const blockchainBalanceSchema = new mongoose.Schema({
  blockchainName: String,
  tokens: [tokenSchema],
});

// Define a schema for the signer
const signerSchema = new mongoose.Schema({
  publicKey: String,
  privateKey: String,
});

// Define a schema for the data
const dummyWalletDataSchema = new mongoose.Schema({
  balances: [blockchainBalanceSchema],
  chains: [String],
  signer: signerSchema,
  tokens: [String],
});

// Create a Mongoose model for the JSON data
const DummyWalletData = mongoose.model('DummyWalletData', dummyWalletDataSchema);

module.exports = DummyWalletData;