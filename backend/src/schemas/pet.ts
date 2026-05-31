import z from "zod";

export const getPetsSchema = z.object({
  query: z.object({
    limit: z.coerce
      .number("Invalid limit")
      .min(10, "Limit must be at least 10")
      .max(50, "Limit can't be more than 50")
      .optional(),
    type: z.enum(["dog", "cat"], "Invalid type").optional(),
  }),
});

export const getPetSchema = z.object({
  query: z.object({
    type: z.enum(["dog", "cat"], "Invalid type, must be cat or dog"),
  }),
});

export const petSchema = z.object({
  body: z.object({
    name: z.string("Invalid name").trim().max(50, "Name can't be longer than 50 characters"),
    description: z.string("Invalid description").trim().max(300, "Description can't be longer than 300 characters"),
    category: z.string("Invalid category").trim().max(50, "Category can't be longer than 50 characters"),
    temperament: z.array(z.string("Invalid temperament").optional(), "Invalid temperament group"),
    type: z.enum(["dog", "cat"], "Invalid type, must be cat or dog"),
    imageURL: z.url("Invalid image URL"),
  }),
});

export const topLikedPetLimitSchema = z.object({
  query: z.object({
    limit: z
      .coerce
      .number("Invalid limit")
      .min(10, "Limit must be at least 10")
      .max(30, "Limit can't be more than 30")
      .optional()
  })
})
