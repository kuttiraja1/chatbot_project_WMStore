document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("messages");
  const sendBtn = document.getElementById("sendBtn");
  const chatBody = document.getElementById("chatBody");

  // use window.chatMode if set by the page (welcome.html), default to 'local'
  let currentMode = (window.chatMode || "local");

  function appendMessage(text, cls) {
    const li = document.createElement("li");
    li.className = cls + " mb-2";
    li.innerHTML = `<div class="${cls.includes('user') ? 'text-end' : 'text-start'}"><span class="badge ${cls.includes('user') ? 'bg-primary' : 'bg-light text-dark'}" style="font-size:0.95rem;">${text}</span></div>`;
    messages.appendChild(li);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function sendMessage(msg) {
    appendMessage(msg, "msg user");
    input.value = "";
    sendBtn.disabled = true;

    // read latest mode from window (allows mode changes)
    currentMode = (window.chatMode || currentMode || "local");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, mode: currentMode })
      });

      if (!res.ok) {
        if (res.status === 401) {
          appendMessage("You must be signed in to chat. Redirecting to login...", "msg system");
          setTimeout(() => { window.location.href = "/login"; }, 1200);
          return;
        }
        appendMessage("Server error. Try again later.", "msg system");
        return;
      }

      const data = await res.json();
      appendMessage(data.reply || "No reply", "msg bot");
    } catch (err) {
      appendMessage("Network error. Check your connection.", "msg system");
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    sendMessage(text);
  });

  // small UX: allow Enter to send
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });

  // quick buttons wiring (existing)
  document.querySelectorAll('.quick').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = btn.getAttribute('data-msg') || '';
      if (!m) return;
      // use sendMessage directly so mode is included
      sendMessage(m);
    });
  });

  // initial greeting from bot reflects current mode
  const greeting = (window.chatMode === 'ai') ?
    "Hi! AI mode active — demo AI responses. Try asking something." :
    "Hi! Local DB mode active — try saying 'hello' or 'time'.";
  appendMessage(greeting, "msg bot");
});