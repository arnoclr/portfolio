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
        const variantName = Object.keys(experiment).find(variantName => {
            return Math.random() < experiment[variantName].percentage
        });
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
