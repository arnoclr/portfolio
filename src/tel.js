import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";

const telForm = document.getElementById('js-tel-form');
const telModal = document.getElementById('js-tel-modal');

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
    telModal.classList.add('ac-tel-modal--open');
    document.body.style.overflow = 'hidden';
}

showPhoneNumber = () => {
    // detect if user is logged in
    //
    openModal();
}

export { showPhoneNumber };
