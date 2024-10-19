"use strict";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'blackout') {
        const wordToBlackout = request.word;
        console.log(wordToBlackout);
        const regex = new RegExp(`(${wordToBlackout})`, 'gi'); // Word boundary regex
        const blackoutWords = (node) => {
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
                        }
                        else {
                            span.appendChild(document.createTextNode(part));
                        }
                    });
                    if (node.parentNode) {
                        node.parentNode.replaceChild(span, node);
                    }
                }
            }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                node.childNodes.forEach(blackoutWords);
            }
        };
        blackoutWords(document.body);
        sendResponse({ status: "Blackout executed" });
    }
});
// function escapeRegExp(string: string) {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
// }
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'blackout') {
//     const wordToBlackout = request.word;
//     console.log(wordToBlackout);
//     const regex = new RegExp(`[${wordToBlackout}\u4E00-\u9FFF，。]`, 'g'); // Match each character individually
//     const blackoutWords = (node: Node) => {
//       if (node.nodeType === Node.TEXT_NODE) {
//         const text = node.nodeValue || '';
//         if (regex.test(text)) {
//           const span = document.createElement('span');
//           // Split the text and wrap the target word with a span
//           const parts = text.split(regex);
//           parts.forEach(part => {
//             if (regex.test(part)) {
//               const blackoutSpan = document.createElement('span');
//               blackoutSpan.style.backgroundColor = 'black';
//               blackoutSpan.style.color = 'black';
//               blackoutSpan.style.userSelect = 'none';
//               blackoutSpan.textContent = part;
//               span.appendChild(blackoutSpan);
//             } else {
//               span.appendChild(document.createTextNode(part));
//             }
//           });
//           if (node.parentNode) {
//             node.parentNode.replaceChild(span, node);
//           }
//         }
//       } else if (node.nodeType === Node.ELEMENT_NODE) {
//         node.childNodes.forEach(blackoutWords);
//       }
//     };
//     blackoutWords(document.body);
//     sendResponse({ status: "Blackout executed" });
//   }
// });
