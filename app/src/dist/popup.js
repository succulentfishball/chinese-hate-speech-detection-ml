"use strict";
var _a;
// Ensure to check for null before adding the event listener
(_a = document.getElementById('blackoutButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
event.preventDefault();    
const blackoutWordInput = document.getElementById('blackoutWordInput');
    // Query for active tabs
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Check if there is at least one active tab
        if (tabs.length > 0) {
            const activeTab = tabs[0]; // Get the first active tab
            // Ensure that activeTab.id is defined before sending the message
            if (activeTab.id !== undefined) {
                chrome.tabs.sendMessage(activeTab.id, { action: 'blackout', word: blackoutWordInput.value }, (response) => {
                    console.log((response === null || response === void 0 ? void 0 : response.status) || "No response received");
                });
            }
            else {
                console.error("Active tab ID is undefined");
            }
        }
        else {
            console.error("No active tab found");
        }
    });
});


window.addEventListener("DOMContentLoaded", (event) => {
    event.preventDefault();
    const button = document.getElementById("submit");
    if (button) {
        button.addEventListener("click", function () {
            if (button.style.backgroundColor === "green") {
                button.textContent = "Moderate Content";
                button.style.backgroundColor = "red";
            } else {
	    	button.textContent = "Page Moderated";
                button.style.backgroundColor = "green";
            }
        });
    }
});
