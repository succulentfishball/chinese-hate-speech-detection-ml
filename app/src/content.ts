// import config from './config.json';

function scrapeAndFilterChinese() {
  console.log('Scraping started!');

  const bodyText = document.documentElement.outerHTML; // Get the entire HTML content
  // Regex to match sequences of Chinese characters, including specific punctuation
  const chineseRegex = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF0C\u3002]+/g; // Match sequences of Chinese characters

  const results = bodyText.match(chineseRegex) || []; // Match Chinese character sequences

  if (results.length > 0) {
    const resultArray: string[] = results.slice();
    // console.log(results);
    sendData(resultArray)
    .then(response => {
        console.log("API response received:", response);
        for (let i = 0; i < response.length; i++) {
          if (response[i] === 1) {
            console.log(resultArray[i]);
            blackoutWords(document.body, resultArray[i]);
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

async function sendData(result: string[]): Promise<number[]> {
  const url = "http://148.100.108.220:80/classify";
  const data = {
      texts: result
  };
  console.log(JSON.stringify(data));

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

const blackoutWords = (node: Node, wordToCensor: string) => {
  // Create a regex pattern from the word to censor, escaping special characters
  const regex = new RegExp(`(${wordToCensor})`, 'gi'); // 'gi' for global and case-insensitive matching

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
  }, 2000); // delay to allow the page to fully load
}

onPageLoad(); // Call the onPageLoad function when the page is fully loaded