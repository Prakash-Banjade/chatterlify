'use client'

import { Button } from "@/components/ui/button";
import useConversation from "@/hooks/useConversation"
import { ImageIcon } from "@radix-ui/react-icons";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi";
import { CldUploadButton } from 'next-cloudinary'

export default function Form() {

    const { conversationId } = useConversation();
    const {
        register,
        handleSubmit,
        setValue,
        setFocus,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = async data => {
        setValue('message', '', { shouldValidate: true });
        setFocus('message')

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    conversationId,
                })
            })


        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message)
            }
        }
    }

    const handleUpload = async (result: any) => {
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: result?.info?.secure_url,
                    conversationId,
                })
            })
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message)
            }
        }
    }

    return (
        <div className="w-full border-t border-border px-3 py-2 flex gap-2 items-center lg:gap-4">
            <Button variant="ghost" size="icon" asChild>
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="iouezutb" // get from setting > upload > add preset - use unsigned
                >
                    <ImageIcon className="h-5 w-5" />
                </CldUploadButton>
            </Button>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex items-center gap-2 lg:gap-4">
                <MessageInput
                    id="message"
                    type="text"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Write a message"
                />
                <Button type="submit" variant="secondary" size="icon" className="bg-transparent hover:bg-transparent rounded-[50%] text-sky-600 text-2xl rotate-90">
                    <HiPaperAirplane />
                </Button>
            </form>
        </div>
    )
}
