import { Metadata } from "next"
import LoginForm from "./components/authComponents/LoginForm"
import AuthPageWrapper from "@/app/components/authComponents/AuthPageWrapper"
import { getServerSession } from 'next-auth'
import { authOptions } from "./api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: `Sign In - ${process.env.APP_NAME}`,
  description: "Provide your credentials for authentication",
}

export default async function Home() {

  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect('/users')
  }

  return (
    <AuthPageWrapper>
      <LoginForm />
    </AuthPageWrapper>
  )
}