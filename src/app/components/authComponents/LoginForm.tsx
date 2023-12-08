"use client"

import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'

import { useForm } from "react-hook-form"
import { type LoginForm } from "@/models/AuthForm"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import CustomAlert from "@/components/utils/Alert"
import { CrossCircledIcon } from '@radix-ui/react-icons'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function LoginForm({ className, ...props }: LoginFormProps) {

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [socialLoading, setSocialLoading] = useState(false);

    const form = useForm<LoginForm>({
        defaultValues: {
            email: "",
            password: '',
        },
    })

    const router = useRouter();

    const onSubmit = async (values: LoginForm) => {
        setLoading(true);
        try {
            const res = await signIn('credentials', { ...values, redirect: false, });


            if (res?.ok && res?.status === 200) router.push('/users')

            if (res?.error) {
                setError('Invalid username or password')
            }

        } catch (e) {
            if (e instanceof Error) {
                return setError(e.message)
            }
            setError('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const socialLogin = async (action: string) => {
        setSocialLoading(true)
        try {
            const res = await signIn(action, { redirect: false });

            if (res?.ok && res?.status === 200) {
                router.push('users')
            }

            if (res?.error) throw new Error('Something went wrong')

        } catch (e) {
            if (e instanceof Error) {
                return setError(e.message)
            }
            setError('Something went wrong')
        } finally {
            setSocialLoading(false);
        }
    }

    return (
        <div className={cn("grid gap-6 w-[90%] max-w-[500px]", className)} {...props}>
            <h2 className="lg:text-3xl text-2xl font-bold tracking-tight text-center mb-5 px-3">Log in to you account</h2>
            <div aria-live="polite" aria-atomic="true">
                {error && (
                    <CustomAlert title={'Error'} description={error || ''} destructive icon={<CrossCircledIcon />} />
                )}
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your email" {...field} type="email" required disabled={loading || socialLoading} />
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
                                    <Input placeholder="********" {...field} type="password" required disabled={loading || socialLoading} />
                                </FormControl>
                                {/* <FormDescription className="flex items-center gap-1.5 mt-10">
                                    <Checkbox id="remember" />
                                    <Label htmlFor="remember">Keep me signed in</Label>
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" aria-disabled={loading || socialLoading} disabled={loading || socialLoading}>
                        {loading ? (
                            <>
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        )
                            : 'Log In'}
                    </Button>
                </form>
            </Form>

            <div className="flex flex-col justify-center items-center gap-3">
                <div className="flex justify-center">
                    <Button variant="link" asChild>
                        <Link href="/">
                            Forget Password?
                        </Link>
                    </Button>
                </div>
                <div className="flex justify-center text-sm">
                    <span className="text-muted-foreground"> Don&apos;t have an account?&nbsp;</span>
                    <Link href="/register" className="hover:underline focus:underline">
                        Register
                    </Link>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <section className="flex gap-3 items-center justify-center">
                <Button variant="outline" type="button" className="grow" title="Continue with GitHub"
                    onClick={() => socialLogin('github')}
                    aria-disabled={socialLoading || loading}
                    disabled={socialLoading || loading}
                >
                    {false ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.gitHub className="mr-2 h-4 w-4" />
                    )}{" "}
                    Github
                </Button>
                <Button variant="outline" type="button" className="grow" title="Continue with Google"
                    onClick={() => socialLogin('google')}
                    aria-disabled={socialLoading || loading}
                    disabled={socialLoading || loading}
                >
                    {false ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google className="mr-2 h-4 w-4" />
                    )}{" "}
                    Google
                </Button>
            </section>
        </div>
    )
}