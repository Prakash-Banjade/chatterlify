import Link from "next/link";
import Logo from "../../../components/utils/Logo";

type Props = {
    children: React.ReactNode
}

export default function AuthPageWrapper({ children }: Props) {
    return (
        <main className="">
            <div className="flex lg:hidden items-center flex-wrap gap-4 justify-between lg:justify-end p-4 text-sm">
                <Link href="/" className="relative lg:hidden z-20 flex items-center text-lg gap-3 font-medium">
                    <Logo />
                    {process.env.APP_NAME}
                </Link>
            </div>
            {/* <ThemeToggle /> */}
            <div className="container relative lg:min-h-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 px-0">
                {/* Left Desktop View */}
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <Link href="/" className="relative z-20 flex items-center text-lg gap-3 font-medium">
                        <Logo />
                        {process.env.APP_NAME}
                    </Link>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-10">
                            <p className="text-lg">
                                <span className="lg:text-5xl text-3xl">
                                    &ldquo;Hang out anytime, anywhere&rdquo;
                                </span>
                                <br />
                                <br />
                                {process.env.APP_NAME} makes it easy and fun to stay close to your favorite people.
                            </p>
                            <footer className="text-sm"><em><strong>Prakash Banjade</strong></em> - Creator, Developer</footer>
                        </blockquote>
                    </div>
                </div>

                {/* Auth Form */}
                <section className="sm:p-5 lg:p-8 xl:p-12 flex items-center justify-center flex-col">
                    {children}
                </section>
            </div>
        </main>
    )
}