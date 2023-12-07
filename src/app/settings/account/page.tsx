import { Separator } from "@/components/ui/separator"
import { NewPasswordForm } from "./newPasswordForm"
import { Metadata } from "next"
import getCurrentUser from "@/lib/actions/getCurrentUser"
import { format } from "date-fns"

export const metadata: Metadata = {
  title: `Settings - Account | ${process.env.APP_NAME}`,
  description: "Manage your account setting.",
}

export default async function SettingsAccountPage() {

  const currentUser = await getCurrentUser();

  if (!currentUser?.email || !currentUser?.id) {
    return null;
  }

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Email</h3>
          <p className="text-sm text-muted-foreground">
            Your email associated with this account
          </p>
        </div>
        <Separator />
        <p className="text-sm italic">{currentUser.email}</p>
      </section>

      {currentUser?.hashedPassword && <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Manage Password</h3>
          <p className="text-sm text-muted-foreground">
            Update your password
          </p>
        </div>
        <Separator />
        <NewPasswordForm user={currentUser} />
      </section>}

      <section className="mt-12">
        <p className="text-center text-sm text-muted-foreground">Joined on: {format(new Date(currentUser?.createdAt), 'dd MMM, yyyy')}</p>
      </section>
    </div>
  )
}