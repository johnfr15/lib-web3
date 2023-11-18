import { Schema, model, Document } from 'mongoose';

// Define a schema for the token values
const tokenPriceDataSchema = new Schema({
  avax: Number,
  bnb: Number,
  eth: Number,
  matic: Number,
  dai: Number,
  usdc: Number,
  usdt: Number,
});

// Define a model for the token values
export const TokenPriceDataModel = model<Document>('TokenPriceData', tokenPriceDataSchema);