// // listen for scrape results
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'scrapeResults') {
//     console.log('Received scraped results:', request.results);
//     // Handle the results as needed
//   }
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   // Check if the tab is fully loaded and the URL matches
//   if (changeInfo.status === 'complete' && tab.url) {
//     // Execute the content script
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       files: ['dist/content.js'] // Replace with the path to your content script
//     });
//   }
// });

// Listen for scrape results
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scrapeResults') {
        console.log('Received scraped results:', request.results);
        // Handle the results as needed
    }
});

// Add listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab is fully loaded, the URL matches, and it is not a chrome:// URL
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        // Execute the content script
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['dist/content.js'] // Replace with the path to your content script
        }).catch(error => {
            console.error("Error executing script:", error);
        });
    }
});



