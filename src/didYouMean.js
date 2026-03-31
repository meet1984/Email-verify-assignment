const levenshtein = require("fast-levenshtein");

const COMMON_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com"
];

function getDidYouMean(email) {
    // Safety checks
    if (!email || typeof email !== "string") return null;
    if (!email.includes("@")) return null;

    const [user, domain] = email.split("@");

    let closest = null;
    let minDistance = Infinity;

    for (let validDomain of COMMON_DOMAINS) {
        const distance = levenshtein.get(domain, validDomain);

        if (distance < minDistance) {
            minDistance = distance;
            closest = validDomain;
        }
    }

    // Only suggest if it's clearly a typo
    if (minDistance <= 2 && closest !== domain) {
        return `${user}@${closest}`;
    }

    return null;
}

module.exports = { getDidYouMean };