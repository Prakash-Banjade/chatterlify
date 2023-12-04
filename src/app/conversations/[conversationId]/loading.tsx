import { Icons } from "@/components/ui/icons";

export default function loading() {
    return (
        <>
            <div className="h-full w-full flex items-center justify-center lg:pl-80">
                <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
        </>
    )
}