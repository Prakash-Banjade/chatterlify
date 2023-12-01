import { withAuth, NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req: NextRequestWithAuth) {
        // `withAuth` augments the `NextRequest` with the `session` object 
        console.log(req.nextUrl.pathname);
        console.log(req.nextauth.token);

    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)


export const config = { matcher: ["/users/:path*", "/conversations/:path*"] }