const fileInput = document.querySelector('#file-input');
const dropZone = document.querySelector('#drop-zone');
const fileStatus = document.querySelector('#file-status');
const textOutput = document.querySelector('#text-output');
const playBtn = document.querySelector('#play-btn');
const pauseBtn = document.querySelector('#pause-btn');
const stopBtn = document.querySelector('#stop-btn');
const copyBtn = document.querySelector('#copy-btn');
const speedRange = document.querySelector('#speed-range');
const speedValue = document.querySelector('#speed-value');

let extractedText = '';
let words = [];
let currentIndex = 0;
let isPaused = false;
let utterance = null;

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const setStatus = (message) => { fileStatus.textContent = message; };
const escapeHtml = (value) => value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));

function renderWords(text) {
  words = text.match(/\S+/g) || [];
  currentIndex = 0;
  if (!words.length) {
    textOutput.innerHTML = '<p class="placeholder">No readable words were found in this file.</p>';
    return;
  }
  textOutput.innerHTML = words.map((word, index) => `<span class="word" data-index="${index}">${escapeHtml(word)}</span>`).join(' ');
}

async function extractPdf(file) {
  if (!window.pdfjsLib) throw new Error('PDF support did not load. Check your network connection and try again.');
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(' '));
  }
  return pages.join('\n\n');
}

async function extractDocx(file) {
  if (!window.JSZip) throw new Error('Word document support did not load. Check your network connection and try again.');
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const documentXml = await zip.file('word/document.xml')?.async('string');
  if (!documentXml) throw new Error('Could not find readable document text in this DOCX file.');
  return documentXml
    .replace(/<w:tab\/>/g, ' ')
    .replace(/<w:br\/>/g, '\n')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

async function extractText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return extractPdf(file);
  if (name.endsWith('.docx')) return extractDocx(file);
  if (name.endsWith('.txt') || name.endsWith('.md') || file.type.startsWith('text/')) return file.text();
  throw new Error('Unsupported file type. Please upload PDF, DOCX, TXT, or Markdown.');
}

async function handleFile(file) {
  if (!file) return;
  stopReading();
  setStatus(`Extracting text from ${file.name}...`);
  try {
    extractedText = (await extractText(file)).replace(/\s+/g, ' ').trim();
    renderWords(extractedText);
    setStatus(`Loaded ${file.name} with ${words.length.toLocaleString()} words.`);
  } catch (error) {
    extractedText = '';
    renderWords('');
    setStatus(error.message);
  }
}

function highlightWord(index) {
  document.querySelector('.word.active')?.classList.remove('active');
  const word = document.querySelector(`[data-index="${index}"]`);
  if (word) {
    word.classList.add('active');
    word.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

function speakFrom(index = currentIndex) {
  if (!words.length) return;
  speechSynthesis.cancel();
  currentIndex = Math.max(0, Math.min(index, words.length - 1));
  highlightWord(currentIndex);
  utterance = new SpeechSynthesisUtterance(words.slice(currentIndex).join(' '));
  utterance.rate = Number(speedRange.value);
  utterance.onboundary = (event) => {
    if (event.name === 'word') {
      const spoken = utterance.text.slice(0, event.charIndex).match(/\S+/g)?.length || 0;
      highlightWord(currentIndex + spoken);
    }
  };
  utterance.onend = () => { currentIndex = Math.min(currentIndex + 1, words.length - 1); };
  isPaused = false;
  speechSynthesis.speak(utterance);
}

function stopReading() {
  speechSynthesis.cancel();
  isPaused = false;
  utterance = null;
  document.querySelector('.word.active')?.classList.remove('active');
}

fileInput.addEventListener('change', (event) => handleFile(event.target.files[0]));
['dragenter', 'dragover'].forEach((type) => dropZone.addEventListener(type, (event) => {
  event.preventDefault();
  dropZone.classList.add('drag-over');
}));
['dragleave', 'drop'].forEach((type) => dropZone.addEventListener(type, (event) => {
  event.preventDefault();
  dropZone.classList.remove('drag-over');
}));
dropZone.addEventListener('drop', (event) => handleFile(event.dataTransfer.files[0]));
dropZone.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') fileInput.click(); });

playBtn.addEventListener('click', () => {
  if (isPaused) {
    isPaused = false;
    speechSynthesis.resume();
  } else {
    speakFrom(currentIndex);
  }
});
pauseBtn.addEventListener('click', () => {
  if (speechSynthesis.speaking) {
    isPaused = true;
    speechSynthesis.pause();
  }
});
stopBtn.addEventListener('click', stopReading);
copyBtn.addEventListener('click', async () => {
  if (!extractedText) return setStatus('There is no extracted text to copy yet.');
  await navigator.clipboard.writeText(extractedText);
  setStatus('Extracted text copied to clipboard.');
});
speedRange.addEventListener('input', () => { speedValue.textContent = `${Number(speedRange.value).toFixed(1)}×`; });
textOutput.addEventListener('click', (event) => {
  const word = event.target.closest('.word');
  if (word) speakFrom(Number(word.dataset.index));
});
