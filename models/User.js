import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Унікальний email
  password: { type: String, required: true }, // Тут буде хеш, а не чистий пароль
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);