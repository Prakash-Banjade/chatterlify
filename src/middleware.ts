import { withAuth, NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
    function middleware(req: NextRequestWithAuth) {
        // `withAuth` augments the `NextRequest` with the `session` object 

    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)


export const config = { matcher: ["/users/:path*", "/conversations/:path*", '/settings/:path*'] }