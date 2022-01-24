import { setUserProperties, logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

const EXPERIMENTS = {
    "links_bio_logos": {
        "variants": {
            "_default":{
                "percentage": 0.5,
                "behavior": function() {
                    
                }
            },
            "with_logos" : {
                "percentage": 0.5,
                "description": "Show logos of social medias next to links",
                "behavior": function() {
                    document.querySelectorAll(".ab__link-bio-logo").forEach(el => {
                        el.style.display = "block";
                    });
                }
            }
        },
        "event" : {
            "name": "open_bio_link",
            "trigger": "click",
            "targets": ".header__links-link"
        }
    }
}

const randomizer = (values) => {
    let i, pickedValue,
            randomNr = Math.random(),
            threshold = 0;

    for (i = 0; i < values.length; i++) {
        threshold += values[i].percentage;
        if (threshold > randomNr) {
                pickedValue = values[i];
                break;
        }
    }

    return pickedValue;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// assign a variant for each experiment
const experimentVariants = {};
Object.keys(EXPERIMENTS).forEach(experimentName => {
    const experiment = EXPERIMENTS[experimentName].variants;
    // check if is already defined in localstorage
    const experimentVariant = localStorage.getItem('ab__' + experimentName);
    if (experimentVariant) {
        experimentVariants[experimentName] = experimentVariant;
        // check if variant is valid
        if (!experiment[experimentVariant]) {
            experimentVariants[experimentName] = "_default";
            localStorage.removeItem('ab__' + experimentName);
        }
    } else {
        const variant = randomizer(Object.values(experiment));
        const variantName = getKeyByValue(experiment, variant);
        experimentVariants[experimentName] = variantName;
        localStorage.setItem('ab__' + experimentName, variantName);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // apply tranformations for each experiment
    Object.keys(experimentVariants).forEach(experimentName => {
        const experimentVariant = experimentVariants[experimentName];
        const experiment = EXPERIMENTS[experimentName].variants;
        const experimentVariantConfig = experiment[experimentVariant];
        if (experimentVariantConfig.behavior) {
            experimentVariantConfig.behavior();
        }
    });

    // log events
    Object.keys(EXPERIMENTS).forEach(experimentName => {
        const experiment = EXPERIMENTS[experimentName];
        if (experiment.event) {
            const event = experiment.event;
            const eventTargets = document.querySelectorAll(event.targets);
            eventTargets.forEach(target => {
                target.addEventListener(event.trigger, function(e) {
                    logEvent(analytics, event.name, {
                        "variant": experimentVariants[experimentName]
                    });
                });
            });
        }
    });
});
