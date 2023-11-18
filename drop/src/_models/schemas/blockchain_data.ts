import { Schema, model, Document } from 'mongoose';

// Define a schema for chain configurations
const blockchainConfigSchema = new Schema({
  chainId: Number,
  gasToken: String,
  name: String,
  rpc: String,
  tokens: [String],
  type: String,
});

// Define a model for the chain configurations
export const BlockchainConfigModel = model<Document>('BlockchainConfig', blockchainConfigSchema);