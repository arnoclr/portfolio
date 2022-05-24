import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY = 'BIJf564X3t7wur264Hj_A8eWLVw3-CNSbLZVp086Pdg_yjGd2Mb4HBPk-aVe7MUazNVp1OWbvZcP_FRyk767jeM';

const banner = document.querySelector('.js-notif-banner');
const enableButton = document.querySelector('.js-notif-enable');
const backdrop = document.querySelector('.js-notif-backdrop');

let canShowNotificationPopupTimeout = false;
let isPersisted = true;

const requestNotificationPermission = async () => {
    let currentToken = false;

    try {
        currentToken = await getToken(messaging, {vapidKey: VAPID_KEY});
    } catch (error) {
        console.log('An error occurred while retrieving token.', error);
    }

    return currentToken;
}

const canShowNotificationPopup = () => {
    if (canShowNotificationPopupTimeout == true && 'Notification' in window && messaging) {
        if(Notification.permission !== "granted" && Notification.permission !== "denied") {
            return true;
        }
    }
    return false;
}

const showNotificationPopup = () => {
    if (!canShowNotificationPopup()) return;
    banner.classList.add('ac-notifications-banner--visible');
}

const hideNotificationPopup = () => {
    if (isPersisted) return;
    banner.classList.remove('ac-notifications-banner--visible');
}

let lastScrollTop = 0;
const detectScrollDirection = event => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
        // downscroll code
        hideNotificationPopup();
    } else {
        // upscroll code
        showNotificationPopup();
    }
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}

enableButton.addEventListener('click', async () => {
    backdrop.style.display = null;
    const token = await requestNotificationPermission();
    if (token) {
        console.log(token);
        banner.style.display = 'none';
    } else {
        alert("Une erreur est survenue au moment de l'activation");
    }
    backdrop.style.display = 'none';
});


window.onscroll = detectScrollDirection;

setTimeout(() => {
    canShowNotificationPopupTimeout = true;
    banner.style.display = null;
    banner.clientWidth;
    showNotificationPopup();

    setTimeout(() => {
        isPersisted = false;
    }, 3000);
}, 15000);

export { showNotificationPopup, hideNotificationPopup }