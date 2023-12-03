'use client'

import { Button } from "@/components/ui/button"
import CustomDialog from "@/components/utils/CustomDialog"
import { MdOutlineGroupAdd } from "react-icons/md"

export default function SettingsModal() {

    const content = (
        <h1>Hey there this is modal</h1>
    )

    return (
        <CustomDialog title={'Add Conversation'} content={content}>
            <Button variant="outline" size="icon" className="text-xl" title="Create new group">
                <MdOutlineGroupAdd />
            </Button>
        </CustomDialog>
    )
}