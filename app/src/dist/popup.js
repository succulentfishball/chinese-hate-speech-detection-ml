"use strict";
// document.getElementById('scrapeButton')?.addEventListener('click', () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const activeTab = tabs[0];
//     if (activeTab?.id !== undefined) {
//       chrome.scripting.executeScript(
//         {
//           target: { tabId: activeTab.id },
//           func: scrapeAndFilterChinese
//         },
//         (results) => {
//           const resultElement = document.getElementById('result');
//           if (resultElement && results && results[0] && results[0].result) {
//             // Use textContent to avoid XSS
//             resultElement.textContent = results[0].result;
//           } else if (resultElement) {
//             resultElement.textContent = 'No results found.';
//           }
//         }
//       );
//     }
//   });
// });
var _a;
// Ensure to check for null before adding the event listener
(_a = document.getElementById('blackoutButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
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
// function scrapeAndFilterChinese(): string {
//   // Scrape the entire HTML content
//   const htmlContent = document.documentElement.outerHTML;
//   // Regular expression to match Chinese characters
//   const chineseCharRegex = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF0C\u3002]/g;
//   // Extract only Chinese characters from the HTML content
//   const chineseCharacters = htmlContent.match(chineseCharRegex)?.join('') || '';
//   return chineseCharacters;
// }
window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("button").addEventListener("click", function() {
        if (document.getElementById("button").style.backgroundColor == "green"){
            location.reload();
        }
    	
        // Change the logo to the "clean and safe" one
        document.getElementById("censorLogo").src = "good_website.webp";
	    document.getElementById("button").textContent = "Page Moderated!";
	    document.getElementById("button").style.backgroundColor = "green";
	});
});
