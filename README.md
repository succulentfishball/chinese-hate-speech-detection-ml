# Chinese Hate Speech Detection Model

## Project Overview
[CITE ORIGINAL MODEL AUTHOR HERE]

### Installation Guide

#### Model

Our model was hosted on the IBM LinuxOne virtual machine, where an API endpoint was exposed using Flask. 

The server receives an input json string with the string array of the phrases to query in the format of ```{text: ["A", "B", "C"]}```. It then outputs a json string with an integer array in the format of ```{results: [0, 1, 0]}```, where a HIGH value represents a hateful comment.

#### Extension

The unpacked extension folder (```app/src```) was loaded in ```chrome://extensions/``` under _Developer Mode_.
