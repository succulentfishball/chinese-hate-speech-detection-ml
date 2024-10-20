# Mandarin Hate Speech Detection Chrome Extension

This Chrome extension scrapes websites for Mandarin text, sends the text to a machine learning model for inference, and censors any words or sentences detected as hate speech. The goal is to promote a safer online environment by identifying and masking harmful content.

## Features
- Scrapes all Mandarin text from the currently visited webpage.
- Runs real-time inference to detect hate speech in the Mandarin language using a machine learning model.
- Automatically highlights or censors detected hate speech.
- Works seamlessly in the background with minimal user interaction.

## How it works
- Scraped mandarin text is sent to LinuxONE Virtual Machine.
- Virtual Machine runs the inference on its model, based off COLD dataset, and sends back hate speech detected.
- User's machine will receive hate speech data, then executes the censoring of these words on the webpage.

### Prerequisites
- Google Chrome browser (latest version)

### Installation & Use

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/succulentfishball/chinese-hate-speech-detection-ml.git
