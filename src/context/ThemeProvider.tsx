"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import * as NProgress from "nprogress";
import { usePathname, useRouter } from "next/navigation";


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {

    const pathname = usePathname()
    const router = useRouter();

    // this is due to stucking of nextjs top loader due to some experimental changes in history obj in Next14 
    React.useEffect(() => {
        NProgress.done();
    }, [pathname, router]);
    
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
