import { Separator } from "@/components/ui/separator"
import { DisplayForm } from "./display-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: `Settings - Display | ${process.env.APP_NAME}`,
    description: "Manage your display setting.",
}


export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Display</h3>
        <p className="text-sm text-muted-foreground">
          Turn items on or off to control what&apos;s displayed in the app.
        </p>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  )
}