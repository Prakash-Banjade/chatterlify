import * as z from "zod"

export const LoginFormSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const RegisterFormSchema = z.object({
    name: z.string().min(2, { message: 'Your name must be at least 2 characters long' }).max(50, { message: `Name can't exceed 50 characters` }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(8, { message: 'Password must be 8 characters long' })
        .max(32, { message: "Password can't exceed 32 characters" })
        .refine((password) => {
            return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/]/.test(password);
        }, { message: "Password must contain at least one lowercase, one uppercase, one number, and one special character." }),
    confirmPassword: z.string(),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: 'custom',
            message: 'Confirm password does not match',
            path: ['confirmPassword'],
        });
    }
});

export type LoginForm = z.infer<typeof LoginFormSchema>
export type RegisterForm = z.infer<typeof RegisterFormSchema>