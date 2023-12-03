import { Separator } from "@/components/ui/separator"
import { AccountForm } from "./account-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: `Settings - Account | ${process.env.APP_NAME}`,
    description: "Manage your account setting.",
}

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  )
}