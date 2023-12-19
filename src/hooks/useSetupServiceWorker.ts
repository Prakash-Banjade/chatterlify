import { registerServiceWorker } from "@/lib/serviceWorker";
import { useEffect } from "react";

export default function useSetupServiceWorker() {
    useEffect(() => {
        async function setUpServiceWorker() {
            try {
                await registerServiceWorker();

            } catch (e) {
                console.error(e);
            }
        }

        setUpServiceWorker(); // this will register the service worker, if the service worker is already present, it will use the existing one
    }, [])
}