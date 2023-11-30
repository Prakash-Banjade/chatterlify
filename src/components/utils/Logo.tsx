import Image from "next/image";

export default function Logo() {
    return (
        <Image
            src="/images/logo.png"
            alt="Logo"
            width={48}
            height={48}
            priority
        />
    )
}