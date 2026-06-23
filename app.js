const fileInput = document.querySelector('#file-input');
const dropZone = document.querySelector('#drop-zone');
const fileStatus = document.querySelector('#file-status');
const textViewer = document.querySelector('#text-viewer');
const playPauseButton = document.querySelector('#play-pause');
const stopButton = document.querySelector('#stop');
const speedInput = document.querySelector('#speed');
const speedValue = document.querySelector('#speed-value');
const copyButton = document.querySelector('#copy-text');
const generateQuizButton = document.querySelector('#generate-quiz');
const quizViewer = document.querySelector('#quiz-viewer');
const wordCount = document.querySelector('#word-count');

let words = [];
let wordElements = [];
let currentIndex = 0;
let isPaused = false;
let activeUtterance = null;
let speechRunId = 0;
let extractedText = '';

const supportedTypes = new Set(['pdf', 'docx', 'txt', 'md', 'markdown']);
const commonWords = new Set([
  'about', 'after', 'again', 'also', 'because', 'before', 'being', 'between', 'could',
  'every', 'from', 'have', 'into', 'more', 'most', 'other', 'over', 'some', 'such',
  'than', 'that', 'their', 'there', 'these', 'they', 'this', 'through', 'were', 'when',
  'where', 'which', 'while', 'with', 'would', 'your'
]);

window.addEventListener('load', () => {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
});

fileInput.addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (file) handleFile(file);
});

['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add('drag-over');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('drag-over');
  });
});

dropZone.addEventListener('drop', (event) => {
  const [file] = event.dataTransfer.files;
  if (file) handleFile(file);
});

dropZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    fileInput.click();
  }
});

playPauseButton.addEventListener('click', () => {
  if (!words.length) return;

  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
    isPaused = true;
    playPauseButton.textContent = 'Play';
    return;
  }

  if (isPaused && speechSynthesis.paused) {
    speechSynthesis.resume();
    isPaused = false;
    playPauseButton.textContent = 'Pause';
    return;
  }

  speakFrom(currentIndex);
});

stopButton.addEventListener('click', stopReading);

speedInput.addEventListener('input', () => {
  speedValue.textContent = `${Number(speedInput.value).toFixed(1)}×`;
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    const restartIndex = currentIndex;
    stopReading(false);
    speakFrom(restartIndex);
  }
});

copyButton.addEventListener('click', async () => {
  if (!extractedText) return;
  await navigator.clipboard.writeText(extractedText);
  const original = copyButton.textContent;
  copyButton.textContent = 'Copied!';
  setTimeout(() => { copyButton.textContent = original; }, 1200);
});

generateQuizButton.addEventListener('click', () => {
  const questions = buildQuiz(extractedText);
  renderQuiz(questions);
});

async function handleFile(file) {
  stopReading();
  const extension = file.name.split('.').pop().toLowerCase();

  if (!supportedTypes.has(extension)) {
    setStatus('Please choose a PDF, Word (.docx), TXT, or Markdown file.', true);
    return;
  }

  setStatus(`Extracting text from ${file.name}…`);

  try {
    const text = await extractText(file, extension);
    if (!text.trim()) throw new Error('No readable text was found in this file.');
    extractedText = normalizeText(text);
    renderWords(extractedText);
    renderQuizPlaceholder('Ready! Select Make quiz to create practice questions.');
    setStatus(`Loaded ${file.name}. Click Play to begin.`);
  } catch (error) {
    extractedText = '';
    renderPlaceholder(error.message || 'Could not extract text from this file.');
    setStatus(error.message || 'Could not extract text from this file.', true);
  }
}

function extractText(file, extension) {
  if (extension === 'pdf') return extractPdfText(file);
  if (extension === 'docx') return extractDocxText(file);
  return file.text();
}

async function extractPdfText(file) {
  if (!window.pdfjsLib) throw new Error('PDF support is still loading. Please try again in a moment.');
  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(' '));
  }

  return pages.join('\n\n');
}

async function extractDocxText(file) {
  if (!window.mammoth) throw new Error('Word document support is still loading. Please try again in a moment.');
  const buffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

function normalizeText(text) {
  return text.replace(/\r\n?/g, '\n').replace(/[\t ]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function renderWords(text) {
  words = text.match(/\S+/g) || [];
  wordElements = [];
  currentIndex = 0;
  textViewer.textContent = '';

  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = word;
    span.dataset.index = String(index);
    span.addEventListener('click', () => speakFrom(index));
    wordElements.push(span);
    textViewer.append(span, document.createTextNode(index === words.length - 1 ? '' : ' '));
  });

  wordCount.textContent = `${words.length.toLocaleString()} ${words.length === 1 ? 'word' : 'words'}`;
  playPauseButton.disabled = words.length === 0;
  stopButton.disabled = words.length === 0;
  copyButton.disabled = words.length === 0;
  generateQuizButton.disabled = words.length < 20;
}


function renderPlaceholder(message) {
  words = [];
  wordElements = [];
  currentIndex = 0;
  textViewer.innerHTML = '';
  const paragraph = document.createElement('p');
  paragraph.className = 'placeholder';
  paragraph.textContent = message;
  textViewer.append(paragraph);
  wordCount.textContent = '0 words';
  playPauseButton.disabled = true;
  stopButton.disabled = true;
  copyButton.disabled = true;
  generateQuizButton.disabled = true;
  renderQuizPlaceholder('Upload a document to make a quiz.');
}

function buildQuiz(text) {
  const vocabulary = Array.from(new Set((text.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || [])
    .map((word) => word.replace(/^['-]+|['-]+$/g, ''))
    .filter((word) => word.length > 3 && !commonWords.has(word))));
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.split(/\s+/).length >= 8);

  return sentences.reduce((questions, sentence) => {
    if (questions.length === 5) return questions;
    const answer = pickAnswer(sentence, vocabulary);
    if (!answer) return questions;
    const choices = shuffle([answer, ...vocabulary.filter((word) => word !== answer).slice(0, 24)]).slice(0, 4);
    if (!choices.includes(answer) || choices.length < 4) return questions;
    questions.push({
      answer,
      prompt: sentence.replace(new RegExp(`\\b${escapeRegExp(answer)}\\b`, 'i'), '_____'),
      choices: shuffle(choices)
    });
    return questions;
  }, []);
}

function pickAnswer(sentence, vocabulary) {
  const sentenceWords = sentence.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || [];
  return sentenceWords
    .map((word) => word.replace(/^['-]+|['-]+$/g, ''))
    .find((word) => vocabulary.includes(word) && !commonWords.has(word));
}

function renderQuiz(questions) {
  quizViewer.innerHTML = '';
  if (!questions.length) {
    renderQuizPlaceholder('This text needs a few longer sentences before a quiz can be generated.');
    return;
  }

  questions.forEach((question, index) => {
    const card = document.createElement('section');
    card.className = 'quiz-question';
    const heading = document.createElement('h3');
    heading.textContent = `${index + 1}. ${question.prompt}`;
    const options = document.createElement('div');
    options.className = 'quiz-options';
    const feedback = document.createElement('p');
    feedback.className = 'quiz-feedback';

    question.choices.forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = choice;
      button.addEventListener('click', () => checkAnswer(button, options, feedback, choice, question.answer));
      options.append(button);
    });

    card.append(heading, options, feedback);
    quizViewer.append(card);
  });
}

function checkAnswer(button, options, feedback, choice, answer) {
  options.querySelectorAll('button').forEach((option) => {
    option.disabled = true;
    if (option.textContent === answer) option.classList.add('correct');
  });

  if (choice === answer) {
    feedback.textContent = 'Correct!';
    return;
  }

  button.classList.add('incorrect');
  feedback.textContent = `Not quite. The answer is ${answer}.`;
}

function renderQuizPlaceholder(message) {
  quizViewer.innerHTML = '';
  const paragraph = document.createElement('p');
  paragraph.className = 'placeholder';
  paragraph.textContent = message;
  quizViewer.append(paragraph);
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function speakFrom(index) {
  stopReading(false);
  currentIndex = index;
  isPaused = false;
  playPauseButton.textContent = 'Pause';
  stopButton.disabled = false;
  speechRunId += 1;
  speakCurrentWord(speechRunId);
}

function speakCurrentWord(runId) {
  if (currentIndex >= words.length) {
    stopReading();
    return;
  }

  highlightWord(currentIndex);
  activeUtterance = new SpeechSynthesisUtterance(words[currentIndex]);
  activeUtterance.rate = Number(speedInput.value);
  activeUtterance.onend = () => {
    if (runId !== speechRunId) return;
    currentIndex += 1;
    speakCurrentWord(runId);
  };
  activeUtterance.onerror = () => {
    if (runId === speechRunId) stopReading();
  };
  speechSynthesis.speak(activeUtterance);
}

function stopReading(resetIndex = true) {
  speechRunId += 1;
  speechSynthesis.cancel();
  activeUtterance = null;
  isPaused = false;
  playPauseButton.textContent = 'Play';
  if (resetIndex) currentIndex = 0;
  clearHighlight();
}

function highlightWord(index) {
  clearHighlight();
  const element = wordElements[index];
  if (!element) return;
  element.classList.add('active');
  element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
}

function clearHighlight() {
  wordElements.forEach((element) => element.classList.remove('active'));
}

function setStatus(message, isError = false) {
  fileStatus.textContent = message;
  fileStatus.style.color = isError ? '#b42318' : '';
}
