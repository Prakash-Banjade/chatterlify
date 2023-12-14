"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { User } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import ButtonWithLoading from "@/components/utils/ButtonWithLoading"

export const newPwdFormSchema = z.object({
    currentPwd: z.string(),
    newPassword: z
        .string()
        .min(8, { message: 'Password must be 8 characters long' })
        .max(32, { message: "Password can't exceed 32 characters" })
        .refine((newPassword) => {
            return /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/]/.test(newPassword);
        }, { message: "Password must contain at least one lowercase, one uppercase, one number, and one special character." }),
    confirmNewPassword: z.string(),
}).superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
        ctx.addIssue({
            code: 'custom',
            message: 'Confirm password does not match',
            path: ['confirmNewPassword'],
        });
    }
});

type NewPwdFormValues = z.infer<typeof newPwdFormSchema>

const defaultValues: Partial<NewPwdFormValues> = {
    currentPwd: '',
    newPassword: '',
    confirmNewPassword: ''
}

type Props = {
    user: Partial<User>,
}


export function NewPasswordForm({ user }: Props) {
    const form = useForm<NewPwdFormValues>({
        resolver: zodResolver(newPwdFormSchema),
        defaultValues,
    })

    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    async function onSubmit(data: NewPwdFormValues) {
        const { currentPwd, newPassword } = data

        if (!user?.hashedPassword) return;

        setLoading(true)

        try {
            const res = await fetch('/api/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPwd: currentPwd,
                    newPwd: newPassword,
                })
            })


            if (!res?.ok && res?.status === 400) {

                const text = await res?.text();

                if (text === 'Incorrect password') {
                    form.setError('currentPwd', {
                        type: 'custom',
                        message: 'Invalid password'
                    })
                    form.setFocus('currentPwd')
                }else{
                    form.setError('newPassword', {
                        type: 'custom',
                        message: text,
                    })
                    form.setFocus('newPassword')
                }
            }

            if (res?.ok) {
                return toast({
                    title: 'Password updated successfully',
                    description: 'You password is udpated',
                })
            }

        } catch (e) {
            if (e instanceof Error) {
                console.log(e)
                toast({
                    title: 'Failed',
                    description: e.message,
                    variant: 'destructive',
                })
            } else {
                toast({
                    title: 'Unable to udpate password',
                    description: 'Something went wrong',
                    variant: 'destructive',
                })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="currentPwd"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current passwrod</FormLabel>
                            <FormControl>
                                <Input placeholder="********" type="password" {...field} required />
                            </FormControl>
                            <FormDescription>
                                Enter your current password
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New passwrod</FormLabel>
                            <FormControl>
                                <Input placeholder="********" type="password" {...field} required />
                            </FormControl>
                            <FormDescription>
                                Enter your new password
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm new passwrod</FormLabel>
                            <FormControl>
                                <Input placeholder="********" type="password" {...field} required />
                            </FormControl>
                            <FormDescription>
                                Once again type you new password to confirm
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <ButtonWithLoading loading={loading} text="Update password" loadingText="Updating" type="submit" />
            </form>
        </Form>
    )
}