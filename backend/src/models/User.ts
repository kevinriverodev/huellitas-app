import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    biography: { type: String, default: "" },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageURL: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    status: { type: Boolean, default: true },
    likedPets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
    savedPets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
  },
  { timestamps: true },
);

const User = model("User", userSchema);

export default User;
