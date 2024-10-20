
function scrapeChineseText() {
  var _a;
  // Scrape the entire HTML content
  const htmlContent = document.documentElement.outerHTML;
  // Regular expression to match Chinese characters
  const chineseCharRegex = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/g;
  // Extract only Chinese characters from the HTML content
  const chineseCharacters = ((_a = htmlContent.match(chineseCharRegex)) === null || _a === void 0 ? void 0 : _a.join('')) || '';
  return chineseCharacters;
}

async function classifyText(sentences) {  
  const response = await fetch('http://172.17.0.2:8080/classify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ texts: sentences })
  });
  const result = await response.json();
  print(result.results);
  return result.results;
}

function highlightHateSpeech(sentences, classifications) {
  const bodyHTML = document.body.innerHTML;
  let newHTML = bodyHTML;
  
  sentences.forEach((sentence, index) => {
    if (classifications[index] === 1) {  // Assuming '1' indicates hate speech
      const censoredSentence = `<span style="background-color: yellow; color: red;">${sentence}</span>`;
      newHTML = newHTML.replace(new RegExp(sentence, 'g'), censoredSentence);
    }
  });

  document.body.innerHTML = newHTML;
}

async function processPage() {
  const sentences = scrapeChineseText();
  if (sentences.length > 0) {
    const classifications = await classifyText(sentences);
    highlightHateSpeech(sentences, classifications);
  }
}

processPage();
