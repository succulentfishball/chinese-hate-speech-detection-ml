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

// Ensure to check for null before adding the event listener
document.getElementById('blackoutButton')?.addEventListener('click', () => {
    const blackoutWordInput = document.getElementById('blackoutWordInput') as HTMLInputElement;

    // Query for active tabs
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      // Check if there is at least one active tab
      if (tabs.length > 0) {
        const activeTab = tabs[0]; // Get the first active tab

        // Ensure that activeTab.id is defined before sending the message
        if (activeTab.id !== undefined) {
          chrome.tabs.sendMessage(activeTab.id, { action: 'blackout', word: blackoutWordInput.value }, (response) => {
            console.log(response?.status || "No response received");
          });
        } else {
          console.error("Active tab ID is undefined");
        }
      } else {
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




  