# Student Read-Aloud App

A browser-based read-aloud helper for students. It accepts PDF, Word (`.docx`), text, and Markdown files, extracts readable text, and reads the text aloud with word highlighting.

## Features

- Drag-and-drop or browse file upload for PDF, Word, TXT, and Markdown documents.
- Automatic text extraction in the browser.
- Play, pause, and stop controls powered by the Web Speech API.
- Amber highlighting for the word currently being spoken.
- Click any extracted word to jump to that point and begin playback.
- Adjustable speed from 0.5× to 2×.
- Copy extracted text to the clipboard.
- Generate a five-question multiple-choice practice quiz from the extracted text.

## Run locally

Open `index.html` directly in a modern browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.
