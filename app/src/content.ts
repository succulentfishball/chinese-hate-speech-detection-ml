function run() {
  const filteredArray = scrapeAndFilterChinese();
  console.log('Filtered array:', filteredArray);
  if (filteredArray.length > 0) {
    sendData(filteredArray)
    .then(response => {
        console.log("API response received:", response);
        for (let i = 0; i < response.length; i++) {
          if (response[i] === 1) {
            console.log(filteredArray[i]);
            blackoutWords(document.body, filteredArray[i]);
          }
      }
    })
    .catch(error => {
        console.error("Error:", error);
    });
  } else {
    console.log('No Chinese characters found.');
  }
};

function scrapeAndFilterChinese(): string[] {
  console.log('Scraping started!');

  const bodyText = document.documentElement.outerHTML; // Get the entire HTML content
  // This regex matches sequences containing at least five Chinese characters
  // and specified punctuation.

  // Breakdown:
  // - (?=(?:[^u4e00-u9fff]*[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]{5,})): Positive lookahead to ensure at least five Chinese characters.
  // - ([\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF0C\u3002，。]+): Captures five or more Chinese characters and specified punctuation.

  const chineseRegex = /(?=(?:[^u4E00-u9FFF]*[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]{5,}))(?:[^u4E00-u9FFF]*)([\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF0C\u3002，。]+)/g;


  // const chineseRegex = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF0C\u3002]+/g; // Match sequences of Chinese characters

  const results = bodyText.match(chineseRegex) || []; // Match Chinese character sequences

  
  if (results.length > 0) {
    const filteredArray = results.slice();
    return filteredArray;
  }
  else {
    const filteredArray: string[] = [];
    return filteredArray;
  }
};

async function sendData(result: string[]): Promise<number[]> {
  const url = "http://148.100.108.220:80/classify";
  const data = {
      texts: result
  };

  try {
      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiResult = await response.json();
      // console.log("Response from API:", apiResult);

      // Extracting the result array from the API response
      const intArray: number[] = apiResult.results; // Access the 'result' property directly
      return intArray;

  } catch (error) {
      console.error("Error making POST request:", error);
      throw error;
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
}

const blackoutWords = (node: Node, wordToCensor: string) => {
  // Create a regex pattern from the word to censor, escaping special characters
  const regex = new RegExp(`(${escapeRegExp(wordToCensor)})`, 'gi'); // 'gi' for global and case-insensitive matching

  if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue || '';
      if (regex.test(text)) {
          const span = document.createElement('span');

          // Split the text and wrap the target word with a span
          const parts = text.split(regex);
          parts.forEach(part => {
              if (regex.test(part)) {
                  const blackoutSpan = document.createElement('span');
                  blackoutSpan.style.backgroundColor = 'black';
                  blackoutSpan.style.color = 'black';
                  blackoutSpan.style.userSelect = 'none';
                  blackoutSpan.textContent = part;
                  span.appendChild(blackoutSpan);
              } else {
                  span.appendChild(document.createTextNode(part));
              }
          });

          if (node.parentNode) {
              node.parentNode.replaceChild(span, node);
          }
      }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(childNode => blackoutWords(childNode, wordToCensor));
  }
};

// Function to handle URL changes
const handleUrlChange = (): void => {
  console.log('URL changed to:', window.location.href);
};

// Override pushState and replaceState to detect URL changes
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(data: any, unused: string, url?: string | URL | null): void {
  originalPushState.call(this, data, unused, url); // Call the original pushState
  handleUrlChange(); // Call your URL change handler
};

history.replaceState = function(data: any, unused: string, url?: string | URL | null): void {
  originalReplaceState.call(this, data, unused, url); // Call the original replaceState
  handleUrlChange(); // Call your URL change handler
};

// Function to load the button state from storage
const getState = (): Promise<string | null> => {
  return new Promise((resolve) => {
      chrome.storage.local.get("buttonState", (data) => {
          if (data.buttonState) {
              const { color } = data.buttonState; // Get only the color
              resolve(color); // Resolve with the color
          } else {
              resolve(null); // Return null if no state is found
          }
      });
  });
};


// Listen for popstate events (for back/forward navigation)
window.addEventListener('popstate', handleUrlChange);

// Function to check if the user has scrolled near the bottom of the page
function checkScroll() {
  const scrollPosition = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // If the user has scrolled near the bottom, run the scraping function
  if (scrollPosition >= documentHeight - 50) { // Adjust the threshold as needed
    getState().then((state) => {
      if (state && state === 'green' || !state) {
        run();
      }
    });
  }
}

// run function when moderated button is enabled.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'runFunction') {
      run();
  }
});

// Add a scroll event listener to the window
window.addEventListener('scroll', checkScroll);

// Function to be called when the page is fully loaded
function onPageLoad() {
  // Set a timeout to delay the scraping function
  setTimeout(() => {
    getState().then((state) => {
      if (state && state === 'green' || !state) {
        run();
      }
    });
  }, 2000); // delay to allow the page to fully load
}

onPageLoad(); // Call the onPageLoad function when the page is fully loaded