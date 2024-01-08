import { registerServiceWorker } from "@/lib/serviceWorker";
import { getCurrentPushSubscription, sendPushSubscriptionToServer } from "@/notification/pushService";
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

    useEffect(() => {
        async function syncPushSubscription(){
            try{
                const subscription = await getCurrentPushSubscription();
                if (subscription) await sendPushSubscriptionToServer(subscription);
            }catch(e){
                console.error(e);
            }
        }

        syncPushSubscription();
    }, [])
}