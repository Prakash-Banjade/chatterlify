import { getReadyServiceWorker } from "@/lib/serviceWorker";

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
    const sw = await getReadyServiceWorker();

    return sw.pushManager.getSubscription();
}

export async function registerPushNotification() {
    if (!('PushManager' in window)) throw Error('Service workers not supported by this browser')

    const existingSubscription = await getCurrentPushSubscription();

    if (existingSubscription) throw Error('Existing push subsription found');

    const sw = await getReadyServiceWorker();

    const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY // generated using web-push library, using the cmd `npx web-push generate-vapid-keys`
    })

    await sendPushSubscriptionToServer(subscription);
}

export async function unregisterPushSubscription() {
    const existingSubscription = await getCurrentPushSubscription();

    if (!existingSubscription) throw Error('No existing push subscription found');

    await removePushSubscriptionFromServer(existingSubscription);
}

export async function sendPushSubscriptionToServer(subscription: PushSubscription) {
    console.log('sending push subscription to server', subscription)
    const response = await fetch('/api/register-push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })

    if (!response.ok) throw Error('Failed to register push subscription');
}

export async function removePushSubscriptionFromServer(subscription: PushSubscription) {
    console.log('removing push subscription from server', subscription)
    const response = await fetch('/api/register-push', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })

    if (!response.ok) throw Error('Failed to delete push subscription');
}