# Student Read-Aloud App

A browser-based reading support tool for students. It extracts text from uploaded course files and reads the content aloud with word-by-word highlighting.

## Features

- Drag-and-drop or browse upload for PDF, Word (`.docx`), TXT, and Markdown files.
- Automatic text extraction in the browser.
- Play, pause, and stop speech controls using the Web Speech API.
- Amber highlighting for the current spoken word.
- Click any word to jump to that point and begin reading from there.
- Reading speed control from 0.5× to 2×.
- Copy extracted text to the clipboard.

## Run locally

Open `index.html` in a browser, or serve the directory with a local static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
