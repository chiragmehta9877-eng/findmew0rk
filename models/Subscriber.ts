import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true },
  preference: { type: String, required: true }, // e.g., "React Developer", "Remote"
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);