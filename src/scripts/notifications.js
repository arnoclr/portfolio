import { getToken, deleteToken } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY = 'BIJf564X3t7wur264Hj_A8eWLVw3-CNSbLZVp086Pdg_yjGd2Mb4HBPk-aVe7MUazNVp1OWbvZcP_FRyk767jeM';

const activationSwitch = document.querySelector('.js-notif-switch');
const checkbox = activationSwitch.querySelector('input');
const backdrop = document.querySelector('.js-notif-backdrop');
const scrollable = document.querySelector('.js-notif-scrollarea');
const banner = document.querySelector('.js-notif-banner');
const bannerPlaceholder = document.querySelector('.js-notif-banner-placeholder');

const requestNotificationPermission = async () => {
    let currentToken = false;

    try {
        currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    } catch (error) {
        console.log('An error occurred while retrieving token.', error);
    }

    return currentToken;
};

const unsubscribeUser = async () => {
    try {
        await deleteToken(messaging);
        checkbox.checked = false;
        localStorage.removeItem('notificationToken');
    } catch (e) {
        alert("Une erreur est survenue lors de la désactivation");
    }
};

const subscribeUser = async () => {
    if (canShowNotificationPopup()) {
        if (!hasGranted()) backdrop.style.display = null;

        const token = await requestNotificationPermission();

        if (token) {
            localStorage.setItem('notificationToken', token);
            checkbox.checked = true;

            try {
                const sampleNotification = new Notification('Parfait !', {
                    body: "Vous recevrez une notification comme celle-ci lorsque des nouveautés seront ajoutées sur mon portfolio.",
                });

                setTimeout(() => {
                    sampleNotification.close();
                }, 6000);
            } catch (e) { }
        } else {
            alert("Une erreur est survenue au moment de l'activation");
        }
        backdrop.style.display = 'none';
    } else {
        alert("Impossible d'activer les notifications sur ce navigateur");
    }
};

const hasGranted = () => {
    return Notification.permission === "granted";
};

const canShowNotificationPopup = () => {
    return Notification.permission !== "denied" && messaging;
};

const isSubscribed = () => {
    return Notification.permission === "granted" && localStorage.getItem('notificationToken');
};

const fixBanner = () => {
    bannerPlaceholder.style.height = banner.offsetHeight + 'px';
    banner.classList.add('ac-notifbanner--fixed');
};

const unfixBanner = () => {
    bannerPlaceholder.style.height = null;
    banner.classList.remove('ac-notifbanner--fixed');
};

activationSwitch.addEventListener('click', async () => {
    activationSwitch.classList.add('ac-switch--loading');
    if (isSubscribed()) {
        await unsubscribeUser();
    } else {
        await subscribeUser();
    }
    activationSwitch.classList.remove('ac-switch--loading');
});

scrollable.addEventListener('scroll', () => {
    if (scrollable.scrollTop > 300) {
        fixBanner();
    } else {
        unfixBanner();
    }
});

if (isSubscribed()) {
    checkbox.checked = true;
};