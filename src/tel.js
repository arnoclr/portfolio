import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";

const telForm = document.getElementById('js-tel-form');
const telModal = document.getElementById('js-tel-modal');
const telModalClose = document.getElementById('js-tel-modal-close');
const telSendNumber = document.getElementById('js-tel-send');
const telNumberInput = document.getElementById('js-tel-number');
const telStepper = document.getElementById('js-tel-stepper');

onSignInSubmit = () => {
    const phoneNumber = grabAndConvertPhoneNumber();
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            console.log('//')
            document.getElementById('js-tel-pane2').scrollIntoView({behavior: 'smooth'})
            // ...
        }).catch((error) => {
            telSendNumber.ariaDisabled = false;
            console.log(error);
            document.getElementById('js-tel-error1').innerText = error.message;
        });
}

grabAndConvertPhoneNumber = () => {
    const phoneNumber = telNumberInput.value;
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

isValidNumber = () => {
    const phoneNumber = telNumberInput.value;
    const formatted = phoneNumber.replace(/[^0-9]/g, '');
    const regex = /0[67][0-9]{8}/;
    return regex.test(formatted);
}

telNumberInput.addEventListener('keyup', (e) => {
    if (isValidNumber()) {
        telSendNumber.ariaDisabled = false;
    } else {
        telSendNumber.ariaDisabled = true;
    }
});

telForm.addEventListener('submit', (e) => {
    e.preventDefault();
    telSendNumber.ariaDisabled = true;
    onSignInSubmit();
});

window.addEventListener("DOMContentLoaded", () => {
    window.recaptchaVerifier = new RecaptchaVerifier('js-tel-recaptcha', {
        'size': 'invisible',
        'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
    }, auth);
})

telModalClose.addEventListener('click', closeModal);

export { showPhoneNumber };
