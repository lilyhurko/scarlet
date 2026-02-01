import mongoose from "mongoose";

const InteractionSchema = new mongoose.Schema({
  personId: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },
  date: { type: Date, default: Date.now },
  notes: String,
  mood: String, 
  tags: [{ 
    label: String, 
    type: { type: String, enum: ["red", "yellow", "green"] } 
  }]
}, { timestamps: true });

export default mongoose.models.Interaction || mongoose.model("Interaction", InteractionSchema);