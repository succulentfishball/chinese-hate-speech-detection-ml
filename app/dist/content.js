"use strict";
const adSelectors = [
    'iframe[src*="ads"]',
    'iframe[src*="ad"]',
    'div[id*="ad"]',
    'div[class*="ad"]',
    'div[id*="banner"]',
    'div[class*="banner"]'
];
function detectAds() {
    const ads = [];
    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(ad => {
            const adElement = ad;
            ads.push(adElement);
            adElement.style.border = "2px solid red"; // Highlight detected ads
        });
    });
    return ads.length;
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "detectAds") {
        const adCount = detectAds();
        sendResponse({ adCount: adCount });
    }
});
