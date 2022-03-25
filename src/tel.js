import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";

const telForm = document.getElementById('js-tel-form');
const telModal = document.getElementById('js-tel-modal');
const telModalClose = document.getElementById('js-tel-modal-close');

onSignInSubmit = () => {
    const phoneNumber = grabAndConvertPhoneNumber();
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
        }).catch((error) => {
            console.log(error);
        });
}

grabAndConvertPhoneNumber = () => {
    const phoneNumber = document.getElementById('js-tel-number').value;
    const convertedPhoneNumber = '+33' + phoneNumber.replace(/[^0-9]/g, '');
    return convertedPhoneNumber;
}

openModal = () => {
    document.body.style.overflow = 'hidden';
    telModal.showModal();
}

closeModal = () => {
    document.body.style.overflow = 'auto';
    telModal.close();

    // get all current params from url
    const urlParams = new URLSearchParams(window.location.search);
    // remove tel from url
    urlParams.delete('tel');
    // update url
    window.history.replaceState({}, '', '?' + urlParams.toString());
}

showPhoneNumber = () => {
    // detect if user is logged in
    //
    openModal();
}

telForm.addEventListener('submit', (e) => {
    e.preventDefault();
    onSignInSubmit();
});

window.addEventListener("DOMContentLoaded", () => {
    window.recaptchaVerifier = new RecaptchaVerifier('js-tel-recaptcha', {
        'size': 'invisible',
        'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log('callback');
        }
    }, auth);
})

telModalClose.addEventListener('click', closeModal);

export { showPhoneNumber };
