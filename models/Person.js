import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  vibeScore: { type: Number, default: 0 },
  ownerEmail: { type: String, required: true },
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Person || mongoose.model("Person", PersonSchema);