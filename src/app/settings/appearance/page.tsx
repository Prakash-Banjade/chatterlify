import { Separator } from "@/components/ui/separator"
import { AppearanceForm } from "./appearance-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: `Settings - Appearance | ${process.env.APP_NAME}`,
    description: "Manage your appearance setting.",
}

export default function SettingsAppearancePage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                    Customize the appearance of the app. Automatically switch between day
                    and night themes.
                </p>
            </div>
            <Separator />
            <AppearanceForm />
        </div>
    )
}