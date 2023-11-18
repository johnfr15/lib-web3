import { Schema, model, Document } from 'mongoose';

// Define a schema for the Action Type
const actionTypeWeightsSchema = new Schema({
  type: String,
  value: Number,
});

// Define a model for the Action Types
export const ActionTypeModel = model<Document>('ActionType', actionTypeWeightsSchema);