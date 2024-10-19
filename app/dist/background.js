"use strict";
chrome.action.onClicked.addListener((tab) => {
    if (tab.id !== undefined) {
        chrome.tabs.sendMessage(tab.id, { action: "detectAds" }, (response) => {
            if (response) {
                chrome.action.setBadgeText({ text: response.adCount.toString(), tabId: tab.id });
            }
        });
    }
    else {
        console.error("Tab ID is undefined");
    }
});
