# Mandarin Hate Speech Detection Chrome Extension

This Chrome extension scrapes websites for Mandarin text, sends the text to a machine learning model for inference, and censors any words or sentences detected as hate speech. The goal is to promote a safer online environment by identifying and masking harmful content.

## Features
- Scrapes all Mandarin text from the currently visited webpage.
- Runs real-time inference to detect hate speech in the Mandarin language using a machine learning model.
- Automatically highlights or censors detected hate speech.
- Works seamlessly in the background with minimal user interaction.


## How It Works
1. **Scraping**: The extension extracts all Chinese text from the webpage.
2. **Inference**: It sends the text to an API hosting a hate speech detection model. API is hosted on LinuxONE Virtual Machine.
3. **Detection**: Virtual Machine runs the inference on its model, based off COLD dataset, and sends back hate speech detected.
4. **Highlighting/Censoring**: User's machine will receive hate speech data, then executes the censoring of these words on the webpage.

## Demo

Here is an example of how the extension works on a sample webpage:

insert screenshot here


### Prerequisites
- Google Chrome browser (latest version)

### Installation & Usage

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/succulentfishball/chinese-hate-speech-detection-ml.git
