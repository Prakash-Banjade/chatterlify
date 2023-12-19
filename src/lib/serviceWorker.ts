export async function registerServiceWorker() {
    // some old browsers doesn't support service workers, so need to check
    if (!('serviceWorker' in navigator)) throw Error('Service workers not supported by this browser')

    await navigator.serviceWorker.register('/serviceWorker.js');
}

// below function allows to retrieve the service worker later
export async function getReadyServiceWorker(){
    if (!('serviceWorker' in navigator)) throw Error('Service workers not supported by this browser')
    
    return navigator.serviceWorker.ready; // return Promise that is resolved only when service worker is successfully registered
}