'use client'

import { Input } from "@/components/ui/input"
import useConversation from "@/hooks/useConversation";
import { debounce } from "lodash";
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

    const { conversationId } = useConversation();

    const handleTyping = debounce((isTyping: boolean) => {
        if (isTyping) {
            fetch('/api/typing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'applciation/json',
                },
                body: JSON.stringify({
                    conversationId
                })
            }).catch(e => console.log(e))
        }
    }, 500);

    return (
        <div className="relative w-full">
            <Input type={type} id={id} autoComplete={id} {...register(id, { required })} placeholder={placeholder} className="border-none rounded-full bg-backgroundSecondary shadow-sm" onKeyDown={() => handleTyping(true)} />
        </div>
    )
}
