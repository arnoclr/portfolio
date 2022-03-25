import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, firestore } from "./firebase";
import { doc, getDoc } from "firebase/firestore/lite";
import * as qr from "qr-ts";

const telForm = document.getElementById('js-tel-form');
const telModal = document.getElementById('js-tel-modal');
const telModalClose = document.getElementById('js-tel-modal-close');
const telSendNumber = document.getElementById('js-tel-send');
const telNumberInput = document.getElementById('js-tel-number');
const telSendCode = document.getElementById('js-tel-send-code');
const telCodeInput = document.getElementById('js-tel-code');
const telOutput = document.getElementById('js-tel-output');

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

generateFinalPane = async () => {
    document.getElementById('js-tel-pane3').scrollIntoView({behavior: 'smooth'})

    const tel = await getPhoneNumber();

    telOutput.href = "https://wa.me/+33" + tel;
    telOutput.innerText = tel.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');

    const VCARD = `BEGIN:VCARD
VERSION:2.1
N:Cellarier;Arno
FN:Arno Cellarier
TITLE;CHARSET=UTF-8:développeur web
TEL:${tel}
EMAIL:bonjour@arnocellarier.fr
ADR;CHARSET=UTF-8:;;;;Île de France;;France
URL:https://arnocellarier.fr/?utm_source=contact_page
END:VCARD`;

    const code = qr.renderOnCanvas(qr.generate(VCARD), "js-tel-qr-output");
    const prev = document.getElementById("js-tel-qr-output");
    if (prev != null) prev.replaceWith(code);
    else document.getElementById("js-tel-qr").appendChild(code);
}

isUserSingedIn = () => {
    return !!auth.currentUser;
}

getPhoneNumber = async () => {
    const docRef = doc(firestore, 'restricted/contact');
    const docSnap = await getDoc(docRef);

    return docSnap.data().tel;
}

showPhoneNumber = () => {
    openModal();
    window.canSkipPane = true;
}

isValidNumber = () => {
    const phoneNumber = telNumberInput.value;
    const formatted = phoneNumber.replace(/[^0-9]/g, '');
    const regex = /0[67][0-9]{8}/;
    return regex.test(formatted);
}

verifyCode = () => {
    telSendCode.ariaDisabled = true;
    const code = telCodeInput.value;
    confirmationResult.confirm(code).then((result) => {
        // User signed in successfully.
        const user = result.user;
        generateFinalPane();
    }).catch((error) => {
        document.getElementById('js-tel-error2').innerText = error.message;
        telSendCode.ariaDisabled = false;
        telCodeInput.value = '';
    });
}

telSendCode.addEventListener('click', verifyCode);

telCodeInput.addEventListener('keyup', (e) => {
    const code = telCodeInput.value;
    if (code.length === 6) {
        verifyCode();
    }
});

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

auth.onAuthStateChanged(user => {
    if (user && window.canSkipPane) {
        generateFinalPane();
    }
})

export { showPhoneNumber };
