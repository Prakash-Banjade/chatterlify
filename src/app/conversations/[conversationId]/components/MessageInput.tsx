'use client'

import { Input } from "@/components/ui/input"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

type Props = {
    placeholder: string,
    id: string,
    type?: string,
    required?: boolean,
    register: UseFormRegister<FieldValues>,
    errors: FieldErrors,
}

export default function MessageInput({ placeholder, id, type, required, register, errors }: Props) {
    return (
        <div className="relative w-full">
            <Input type={type} id={id} autoComplete={id} {...register(id, { required })} placeholder={placeholder} className="border-none rounded-full bg-backgroundSecondary shadow-sm" />
        </div>
    )
}
