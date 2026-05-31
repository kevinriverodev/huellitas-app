import z from "zod";

export const signUpSchema = z.object({
  body: z.object({
    username: z
      .string("Invalid username")
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username can't exceed 20 characters"),
    firstName: z
      .string("Invalid first name")
      .trim()
      .min(2, "First name must be at least 2 characters long")
      .max(50, "First name can't exceed 50 characters"),
    lastName: z
      .string("Invalid last name")
      .trim()
      .min(2, "Last name must be at least 2 characters long")
      .max(50, "Last name can't exceed 50 characters"),
    password: z
      .string("Invalid password")
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password can't exceed 20 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    biography: z.string().trim().max(150, "Biography can't exceed 150 characters").optional(),
    email: z.email("Invalid email format"),
    imageURL: z.url("Invalid profile image").or(z.literal("")).optional(),
  }),
});

export const signInSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username can't exceed 20 characters"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});
