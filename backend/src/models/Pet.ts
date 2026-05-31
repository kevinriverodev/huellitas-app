import { Schema, model, type InferSchemaType } from "mongoose";

const petSchema = new Schema(
  {
    apiId: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    temperament: [{ type: String }],
    type: { type: String, enum: ["dog", "cat"], required: true },
    imageURL: { type: String, required: true },
  },
  { timestamps: true },
);

type AllPetAttributes = InferSchemaType<typeof petSchema>;
export type PetAttributes = Omit<AllPetAttributes, "_id" | "createdAt" | "updatedAt">;
export const Pet = model("Pet", petSchema);
