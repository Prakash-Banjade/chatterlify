import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface UsersLoadingProps {
    variant: 'chats' | 'users'
}

const UserLoadingSkeleton = () => {
    return <div className="flex items-center gap-5">
        <Skeleton className="md:h-10 md:w-10 h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[15ch]" />
            <Skeleton className="h-4 w-[10ch]" />
        </div>
    </div>
}

const fakeArray = new Array(10).fill('')

export function LoadingUsers({ className }: { className?: string }) {
    return <section className={cn("px-4 flex flex-col gap-5", className)}>
        {
            fakeArray.map((_, i) => <UserLoadingSkeleton key={i} />)
        }
    </section>
}

export default function UsersLoading({ variant }: UsersLoadingProps) {

    const loading = (
        <div className="mb-4 pt-4">
            <div className="flex-col flex">
                {variant === "chats" && <div className="mb-5 px-4 flex justify-between items-center">
                    <Skeleton className="w-20 h-7" />
                    <Skeleton className="w-10 h-10" />
                </div>}
                <div className="mb-5 px-4">
                    <Skeleton className="w-full h-7 rounded-full" />
                </div>
                <section className="px-4 flex flex-col gap-4">
                    {
                        fakeArray.map((_, i) => <UserLoadingSkeleton key={i} />)
                    }
                </section>
            </div>
        </div>
    )

    return variant === 'chats' ?
        <aside className="fixed inset-y-0 pb-20 lg:bg-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r w-full left-0">
            {loading}
        </aside> : loading
}
