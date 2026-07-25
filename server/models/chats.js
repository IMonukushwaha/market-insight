const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    type: { type: String, enum: ["text", "stock_insight"], default: "text" },
  },
  { timestamps: true }
);

const chatSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "New Chat" },
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);