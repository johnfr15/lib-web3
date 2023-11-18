import { Schema, model, Document } from 'mongoose';

// Define a schema for protocols
const protocolSchema = new Schema({
  actions: [String],
  name: String,
});

// Define a schema for transactions
const actionSchema = new Schema({
  blockchain: String,
  protocols: [protocolSchema], // Array of protocols
  type: String,
});

// Define a model for the transactions
export const ActionModel = model<Document>('Action', actionSchema);