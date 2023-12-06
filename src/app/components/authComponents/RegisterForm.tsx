"use client"

import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RegisterFormSchema, type RegisterForm } from "@/models/AuthForm";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> { }


export default function RegisterForm({ className, ...props }: LoginFormProps) {

    const form = useForm<RegisterForm>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const { toast } = useToast();

    const [loading, setLoading] = useState(false);


    async function onSubmit(values: RegisterForm) {
        const { name, email, password } = values;
        setLoading(true);

        try {
            const res = await fetch(`${process.env.FRONTEND_URL!}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })

            const data = await res.json();

            if (res.status === 201) {
                toast({
                    title: 'Successfully registered',
                    description: 'You have successfully registered',
                })
                form.reset();
            } else {
                throw new Error(data.message)
            }
        } catch (e) {
            if (e instanceof Error) {
                console.log(e)
                toast({
                    title: 'Registration Failed',
                    description: e.message,
                    variant: 'destructive',
                })
            } else {
                toast({
                    title: 'Registration Failed',
                    description: 'Something went wrong',
                    variant: 'destructive',
                })
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("grid gap-6 w-[90%] max-w-[500px]", className)} {...props}>
            <h2 className="lg:text-3xl text-2xl font-bold tracking-tight text-center mb-5 px-3">Enter the details below for registration</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg. John Doe" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg. johndoe@example.com" {...field} type="email" required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="********" {...field} type="password" required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="********" {...field} type="password" required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" aria-disabled={loading} disabled={loading}>
                        {loading ? (
                            <>
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                Registering...
                            </>
                        )
                            : 'Register'}
                    </Button>
                </form>
            </Form>

            <div className="flex justify-center items-center text-sm">
                <span className="text-muted-foreground">Already have an account?&nbsp;</span>
                <Link href="/" className="hover:underline focus:underline">
                    Log In
                </Link>
            </div>

        </div>
    )
}