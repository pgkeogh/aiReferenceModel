// js/chatbot.js

// Import uiElements from main.js now
import { uiElements } from "./main.js";

/**
 * Adds a chat message to the display.
 * @param {string} sender - 'user' or 'ai'.
 * @param {string} message - The message content.
 */
export function addChatMessage(sender, message) {
  if (!uiElements.chatMessages) {
    console.error("Chat messages container not found in uiElements.");
    return;
  }

  const messageElement = document.createElement("div");
  messageElement.className = `p-2 my-1 rounded-lg max-w-[80%] ${
    sender === "user"
      ? "bg-blue-600 text-white ml-auto"
      : "bg-gray-700 text-purple-100 mr-auto"
  }`;
  messageElement.textContent = message;
  uiElements.chatMessages.appendChild(messageElement);
  uiElements.chatMessages.scrollTop = uiElements.chatMessages.scrollHeight; // Auto-scroll to bottom
}

// You can uncomment and use the functions below if you decide to activate the chatbot.
// For now, they are just examples.

/*
// Example of how to use addChatMessage (if you activate the chatbot)
document.addEventListener('DOMContentLoaded', () => {
    if (uiElements.sendChatButton && uiElements.chatInput) {
        uiElements.sendChatButton.addEventListener('click', () => {
            const message = uiElements.chatInput.value.trim();
            if (message) {
                addChatMessage('user', message);
                uiElements.chatInput.value = '';
                // Simulate AI response
                setTimeout(() => {
                    addChatMessage('ai', `Thinking about "${message}"...`);
                }, 500);
            }
        });

        uiElements.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                uiElements.sendChatButton.click();
            }
        });
    }
});
*/
