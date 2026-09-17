const input = document.querySelector("#api-url");
const status = document.querySelector("#status");

async function restore() {
  const { apiUrl = "http://localhost:5000" } = await chrome.storage.sync.get("apiUrl");
  input.value = apiUrl;
}

document.querySelector("#save").addEventListener("click", async () => {
  try {
    const apiUrl = new URL(input.value).origin;
    const permission = `${apiUrl}/*`;
    const granted = await chrome.permissions.contains({ origins: [permission] }) || await chrome.permissions.request({ origins: [permission] });
    if (!granted) throw new Error("Backend permission was not granted.");
    await chrome.storage.sync.set({ apiUrl });
    status.style.color = "#14804a";
    status.textContent = "Saved.";
  } catch {
    status.textContent = "Enter a valid backend URL, such as http://localhost:5000.";
  }
});

document.querySelector("#test").addEventListener("click", async () => {
  try {
    const apiUrl = new URL(input.value).origin;
    const permission = `${apiUrl}/*`;
    const granted = await chrome.permissions.contains({ origins: [permission] }) || await chrome.permissions.request({ origins: [permission] });
    if (!granted) throw new Error("Backend permission was not granted.");
    const response = await fetch(`${apiUrl}/`);
    if (!response.ok) throw new Error(`Server returned ${response.status}.`);
    status.style.color = "#14804a";
    status.textContent = "Connected to TruthGuard.";
  } catch (error) {
    status.style.color = "";
    status.textContent = error.message || "Could not reach this backend URL.";
  }
});

restore();