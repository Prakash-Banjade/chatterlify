'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import AlertDialogBox from '@/components/utils/AlertDialog'
import useConversation from '@/hooks/useConversation'
import { TrashIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'

export default function ConfirmModal() {

    const router = useRouter();
    const { conversationId } = useConversation();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const { toast } = useToast();

    const onDelete = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/conversations/${conversationId}`, {
                method: 'DELETE',
            })

            if (res?.ok) {
                router.push('/conversations')
                router.refresh();
            } else throw new Error('Failed to delete conversation')
        } catch (e) {
            if (e instanceof Error) {
                return toast({
                    title: 'Error deleting conversation',
                    description: e.message,
                    variant: 'destructive',
                })
            }
            toast({
                title: 'Error deleting conversation',
                description: 'Failed to delete conversation',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    }, [conversationId, router])

    const triggerBtn = (
        <Button variant="destructive" onClick={() => onDelete()} disabled={isLoading}>
            {
                isLoading ? (
                    <>
                        <Icons.spinner className="h-5 w-5 animate-spin" />
                        <span className="ml-2">Deleting...</span>
                    </>
                ) : (
                    <>
                        <TrashIcon className="h-5 w-5" />
                        <span className="ml-2">Delete</span>
                    </>
                )
            }
        </Button>
    )

    const alertDesc = `This action cannot be undone. This will permanently delete this
    conversation and remove data from our servers.`

    const title = "Delete Conversation?"

    const actionIcon = <TrashIcon className="h-10 w-10 text-red-500" />

    return (
        <AlertDialogBox title={title} description={alertDesc} handleFunction={onDelete} loading={isLoading} trigger={triggerBtn} destructive actionIcon={actionIcon} open={open} setOpen={setOpen}>
            <Button variant="outline" size="icon" title="Delete this conversation">
                <TrashIcon className="text-red-500 h-6 w-6" />
            </Button>
        </AlertDialogBox>
    )
}
