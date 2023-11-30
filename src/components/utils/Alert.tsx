
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ReactElement } from "react"

type Prop = {
    title?: string,
    description?: string,
    icon?: ReactElement,
    destructive?: boolean
}

export default function CustomAlert({ title, description, icon, destructive }: Prop) {
    return (
        <Alert variant={destructive ? 'destructive' : 'default'}>
            {icon}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {description}
            </AlertDescription>
        </Alert>
    )
}
