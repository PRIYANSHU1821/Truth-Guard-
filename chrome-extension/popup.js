const DEFAULT_API_URL = "http://localhost:5000";
const MAX_TEXT_LENGTH = 12000;

const status = document.querySelector("#status");
const result = document.querySelector("#result");
const label = document.querySelector("#label");
const confidence = document.querySelector("#confidence");
const explanation = document.querySelector("#explanation");
const verdictDot = document.querySelector("#verdict-dot");
const confidenceBar = document.querySelector("#confidence-bar");
const claimPreview = document.querySelector("#claim-preview");
const characterCount = document.querySelector("#character-count");
const sourceBadge = document.querySelector("#source-badge");
const pageDomain = document.querySelector("#page-domain");
const analyzeButton = document.querySelector("#analyze-claim");

let pageText = "";
let analysisText = "";

function getPageContent() {
  const selection = window.getSelection()?.toString().trim() || "";
  const pageText = document.body?.innerText?.replace(/\s+/g, " ").trim() || "";
  return { selection, pageText };
}

function getVerdictColor(verdict) {
  const value = (verdict || "").toLowerCase();
  if (value.includes("factual")) return "#14804a";
  if (value.includes("questionable")) return "#cf7c17";
  if (value.includes("satire")) return "#516b85";
  return "#d94f2b";
}

function updateCharacterCount() {
  characterCount.textContent = `${analysisText.length.toLocaleString()} characters`;
}

function setAnalysisText(text, source) {
  analysisText = text;
  claimPreview.textContent = text || "No readable text was found on this page.";
  sourceBadge.textContent = source;
  updateCharacterCount();
}

function setLoading(isLoading) {
  analyzeButton.disabled = isLoading;
  analyzeButton.firstElementChild.textContent = isLoading ? "Analyzing claim..." : "Analyze claim";
}

async function getApiUrl() {
  const { apiUrl = DEFAULT_API_URL } = await chrome.storage.sync.get("apiUrl");
  const origin = new URL(apiUrl).origin;
  const permission = `${origin}/*`;
  const granted = await chrome.permissions.contains({ origins: [permission] });
  if (!granted) throw new Error("Allow the backend URL in Settings before analysis.");
  return origin;
}

async function analyze(text) {
  if (!text) {
    status.textContent = "Select text on the page, or analyze the page text.";
    return;
  }

  setLoading(true);
  result.hidden = true;
  status.textContent = "";

  try {
    const apiUrl = await getApiUrl();
    const response = await fetch(`${apiUrl}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, MAX_TEXT_LENGTH) })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error || "Analysis request failed.");

    label.textContent = data.label || "Analysis complete";
    const confidenceValue = Number.isFinite(data.confidence) ? Math.round(data.confidence * 100) : 0;
    confidence.textContent = confidenceValue ? `${confidenceValue}% confidence` : "";
    confidenceBar.style.width = `${confidenceValue}%`;
    explanation.textContent = data.explanation || "No explanation returned.";
    const verdictColor = getVerdictColor(data.label);
    verdictDot.style.backgroundColor = verdictColor;
    confidenceBar.style.backgroundColor = verdictColor;
    result.hidden = false;
  } catch (error) {
    status.textContent = `${error.message} Check Backend settings and make sure TruthGuard is running.`;
  } finally {
    setLoading(false);
  }
}

async function initialize() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    status.textContent = "No active browser tab found.";
    setLoading(false);
    return;
  }

  try {
    const [{ result: content }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: getPageContent });
    pageText = content.pageText;
    setAnalysisText(content.selection || pageText, content.selection ? "PAGE SELECTION" : "PAGE TEXT");
    pageDomain.textContent = tab.url ? new URL(tab.url).hostname : "Current page";
  } catch {
    pageDomain.textContent = "This page cannot be read by the extension.";
  }
  setLoading(false);
}

document.querySelector("#use-page").addEventListener("click", () => {
  setAnalysisText(pageText, "PAGE TEXT");
});
analyzeButton.addEventListener("click", () => analyze(analysisText));
document.querySelector("#analyze-again").addEventListener("click", () => analyze(analysisText));
document.querySelector("#copy-result").addEventListener("click", async () => {
  await navigator.clipboard.writeText(`${label.textContent} (${confidence.textContent})\n\n${explanation.textContent}`);
  status.textContent = "Assessment copied.";
  setTimeout(() => { status.textContent = ""; }, 1800);
});

initialize();