import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, enum: ["dating", "friend", "work", "other"], default: "dating" },
  status: { type: String, enum: ["active", "archived"], default: "active" },
  vibeScore: { type: Number, default: 0 },
  imageUrl: { type: String, default: "" }, 
}, { timestamps: true });

export default mongoose.models.Person || mongoose.model("Person", PersonSchema);