// import config from './config.json';

function scrapeAndFilterChinese() {
  console.log('Scraping started!');

  const bodyText = document.documentElement.outerHTML; // Get the entire HTML content
  // Regex to match sequences of Chinese characters, including specific punctuation
  const chineseRegex = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF0C\u3002]+/g; // Match sequences of Chinese characters

  const results = bodyText.match(chineseRegex) || []; // Match Chinese character sequences

  if (results.length > 0) {
    const resultArray: string[] = results.slice();
    const test: string[] = ["\u9ed1\u4eba\u559c\u6b22\u5077\u4e1c\u897f"];
    // console.log(results);
    sendData(test);
  } else {
    console.log('No Chinese characters found.');
  }
};

// function scrapeAndFilterChinese(): string {
//   // Scrape the entire HTML content
//   const htmlContent = document.documentElement.outerHTML;
//   // Regular expression to match Chinese characters
//   const chineseCharRegex = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF0C\u3002]/g;
//   // Extract only Chinese characters from the HTML content
//   const chineseCharacters = htmlContent.match(chineseCharRegex)?.join('') || '';

//   return chineseCharacters;
// }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'blackout') {
    const wordToBlackout = request.word;
    console.log(wordToBlackout);
    const regex = new RegExp(`(${wordToBlackout})`, 'gi'); // Word boundary regex

    const blackoutWords = (node: Node) => {
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
        node.childNodes.forEach(blackoutWords);
      }
    };

    blackoutWords(document.body);
    sendResponse({ status: "Blackout executed" });
  }
});

async function sendData(result: string[]) {
  const url = "http://148.100.108.220:8080/classify";
  const data = {
      texts: result
  };
  console.log(JSON.stringify(data));

  try {
      const response = await fetch(url, {
          method: "POST",
          headers: {
              scheme: 'http',
              "Content-Type": "application/json"
          },
          body: "{\"texts\": [\"黑人喜欢偷东西\"]}"
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response from API:", result);
  } catch (error) {
      console.error("Error making POST request:", error);
  }
}

// Function to check if the user has scrolled near the bottom of the page
// function checkScroll() {
//   const scrollPosition = window.scrollY + window.innerHeight;
//   const documentHeight = document.documentElement.scrollHeight;

//   // If the user has scrolled near the bottom, run the scraping function
//   if (scrollPosition >= documentHeight - 50) { // Adjust the threshold as needed
//     scrapeAndFilterChinese();
//   }
// }

// Add a scroll event listener to the window
// window.addEventListener('scroll', checkScroll);

// Function to be called when the page is fully loaded
function onPageLoad() {
  // Set a timeout to delay the scraping function
  setTimeout(() => {
    scrapeAndFilterChinese();
  }, 2000); // Adjust the delay (in milliseconds) as needed
}

onPageLoad(); // Call the onPageLoad function when the page is fully loaded