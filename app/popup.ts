document.getElementById('scrapeButton')?.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab?.id !== undefined) {
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          func: scrapeAndFilterChinese
        },
        (results) => {
          const resultElement = document.getElementById('result');
          if (resultElement && results && results[0] && results[0].result) {
            // Use textContent to avoid XSS
            resultElement.textContent = results[0].result;
          } else if (resultElement) {
            resultElement.textContent = 'No results found.';
          }
        }
      );
    }
  });
});

function scrapeAndFilterChinese(): string {
  // Scrape the entire HTML content
  const htmlContent = document.documentElement.outerHTML;
  // Regular expression to match Chinese characters
  const chineseCharRegex = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/g;
  // Extract only Chinese characters from the HTML content
  const chineseCharacters = htmlContent.match(chineseCharRegex)?.join('') || '';
  return chineseCharacters;
}




  