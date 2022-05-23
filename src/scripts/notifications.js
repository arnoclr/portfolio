import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.

const requestNotificationPermission = async () => {
    getToken(messaging, { vapidKey: 'BIJf564X3t7wur264Hj_A8eWLVw3-CNSbLZVp086Pdg_yjGd2Mb4HBPk-aVe7MUazNVp1OWbvZcP_FRyk767jeM' }).then((currentToken) => {
    if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        console.log(currentToken)
    } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
    }
    }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
    });
}

export { requestNotificationPermission }