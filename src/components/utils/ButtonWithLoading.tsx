import { Button } from "../ui/button"
import { Icons } from "../ui/icons"

type ButtonVariants = 'default' | 'outline' | 'destructive' | 'ghost' | 'secondary' | 'link'

type Props = {
    loading: boolean,
    text: string,
    loadingText?: string
    variant?: ButtonVariants
    type?: 'submit' | 'button' | 'reset' | undefined,
}

export default function ButtonWithLoading({ loading, text, loadingText, variant, type }: Props) {
    return (
        <Button variant={variant || 'default'} type={type || 'submit'} disabled={loading} aria-disabled={loading} className="disabled:cursor-not-allowed">
            {loading ? (
                <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText || text}...
                </>
            )
                : text}
        </Button>
    )
}
