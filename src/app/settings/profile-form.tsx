"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { User } from "@prisma/client"
import { useState } from "react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { CldUploadButton } from "next-cloudinary"
import { Icons } from "@/components/ui/icons"

const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 50 characters.",
        }),
    image: z.string().url().optional(),
    bio: z.string().max(160).min(4).optional(),
    urls: z
        .array(
            z.object({
                value: z.string().url({ message: "Please enter a valid URL." }),
            })
        )
        .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

type Props = {
    currentUser: Partial<User>
}

export function ProfileForm({ currentUser }: Props) {

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: currentUser?.name || 'Your name',
        },
    })

    const image = form.watch('image');

    const { fields, append } = useFieldArray({
        name: "urls",
        control: form.control,
    })

    const handleUpload = (result: any) => {
        form.setValue('image', result?.info?.secure_url, { // comes from cloudinary
            shouldValidate: true
        })
    }

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/settings/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            if (!res.ok) throw new Error('Someting went wrong');

            toast({
                title: 'Profile Updated'
            })

        } catch (e) {
            if (e instanceof Error) {
                return toast({
                    title: 'Error updating profile',
                    description: e.message,
                    variant: 'destructive'
                })
            }
            return toast({
                title: 'Error updating profile',
                description: 'Something went wrong',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="flex flex-col gap-3 justify-start items-start">
                    <Label className="text-sm">Profile Image</Label>
                    <Image
                        alt="Profile Image"
                        src={image || currentUser?.image || '/images/avatarPlaceholder.webp'}
                        height={80}
                        width={80}
                        className="rounded-[50%] outline-8 outline-border outline-offset-2"
                        priority={true}
                    />
                    <CldUploadButton
                        className="w-fit"
                        options={{ maxFiles: 1 }}
                        onUpload={handleUpload}
                        uploadPreset="iouezutb"
                    >
                        <Button disabled={isLoading} variant="secondary" size="sm" type="button" asChild>
                            <span>Change</span>
                        </Button>
                    </CldUploadButton>
                </section>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your Name" disabled={isLoading} {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                You can <span>@mention</span> other users and organizations to
                                link to them.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    {fields.map((field, index) => (
                        <FormField
                            control={form.control}
                            key={field.id}
                            name={`urls.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                                        URLs
                                    </FormLabel>
                                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                                        Add links to your website, blog, or social media profiles.
                                    </FormDescription>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => append({ value: "" })}
                    >
                        Add URL
                    </Button>
                </div>
                <Button type="submit" disabled={isLoading}>
                    {
                        isLoading ? (
                            <>
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update profile"
                        )
                    }
                </Button>
            </form>
        </Form >
    )
}