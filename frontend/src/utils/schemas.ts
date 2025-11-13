import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(60),
  email: z.string().email({ message: "Invalid email address" }),
  address: z
    .string()
    .max(400, { message: "Address cannot exceed 400 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(16, { message: "Password must not exceed 16 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(16, { message: "Password must not exceed 16 characters" })
      .regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/, {
        message:
          "Password must contain at least one uppercase letter, one number, and one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
  });

export const addUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  address: z.string().optional(),
  role: z.enum(["USER", "ADMIN", "STORE_OWNER"]),
});

export const addStoreSchema = z.object({
  name: z.string().min(2, "Store name is required"),
  address: z.string().min(5, "Address is required"),
  ownerId: z.string().min(1, "An owner must be selected"),
});

export const signupOwnerSchema = signupSchema.extend({
  storeName: z.string().min(2, { message: "Store name is required" }),
  storeAddress: z.string().min(5, { message: "Store address is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type AddUserFormData = z.infer<typeof addUserSchema>;
export type AddStoreFormData = z.infer<typeof addStoreSchema>;
export type SignupOwnerFormData = z.infer<typeof signupOwnerSchema>;
