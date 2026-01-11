import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: "super_admin" | "admin" | "user";
  isActive: boolean;

  // 🔥 PROFILE FIELDS (User Manual Entry)
  headline?: string;
  location?: string;      // User jo khud enter karega
  lookingFor?: string;
  linkedin?: string;
  x_handle?: string;
  instagram?: string;

  // 🔥 TRACKING FIELDS (Auto Detected)
  ip?: string;
  detectedLocation?: string; // 🔥 NEW: Auto-detected location
  lastLogin?: Date;

  // 🔥 Bookmarks (Reference to Job Model)
  bookmarks: mongoose.Types.ObjectId[]; 

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, default: "user" },
    isActive: { type: Boolean, default: true },

    // 🔥 PROFILE FIELDS
    headline: { type: String, default: "" },
    location: { type: String, default: "" }, // Manual Entry
    lookingFor: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    x_handle: { type: String, default: "" },
    instagram: { type: String, default: "" },

    // 🔥 TRACKING FIELDS
    ip: { type: String },
    detectedLocation: { type: String, default: "" }, // 🔥 Auto Entry
    lastLogin: { type: Date },

    // 🔥 Bookmarks Logic
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;