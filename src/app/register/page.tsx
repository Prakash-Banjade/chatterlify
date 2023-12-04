import { Metadata } from "next"
import AuthPageWrapper from "@/app/components/authComponents/AuthPageWrapper"
import RegisterForm from "../components/authComponents/RegisterForm"
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: `Register - ${process.env.APP_NAME}`,
    description: "Provide your details for registration",
}

export default async function Register() {

    const session = await getServerSession(authOptions);

    if (session?.user) {
        redirect('/users')
    }

    return (
        <AuthPageWrapper>
            <RegisterForm />
        </AuthPageWrapper>
    )
}