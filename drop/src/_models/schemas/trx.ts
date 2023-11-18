import mongoose from "mongoose";

const Schema = mongoose.Schema;

const trxSchema = new Schema({
  actionType: { type: String, required: true },
  amountIn: { type: String, required: true },
  amountOut: { type: String, required: true },
  blockchain: { type: String, required: true },
  botId: { type: String, required: true },
  gasSpent: { type: String, required: true },
  hashId: { type: String, required: true },
  protocol: { type: String, required: true },
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  tokenIn: { type: String, required: true },
  tokenOut: { type: String, required: true },
  valueIn: { type: String, required: true },
  valueOut: { type: String, required: true },
  walletId: { type: String, required: true }
});

export const TrxSchema = mongoose.model('TrxSchema', trxSchema);