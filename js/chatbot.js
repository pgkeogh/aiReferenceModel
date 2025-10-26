import { uiElements } from './dataStore.js';

/**
 * Appends a message to the chatbot display.
 * @param {string} message - The message content.
 * @param {string} sender - 'user' or 'ai'.
 */
export function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `p-2 my-1 rounded-lg max-w-[80%] ${
        sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-purple-700 text-purple-100 mr-auto'
    }`;
    messageElement.textContent = message;
    uiElements.chatMessages.appendChild(messageElement);
    uiElements.chatMessages.scrollTop = uiElements.chatMessages.scrollHeight; // Scroll to bottom
}

/**
 * Handles sending a message from the user.
 */
export async function sendMessage() {
    const message = uiElements.chatInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    uiElements.chatInput.value = '';

    // Placeholder for AI response
    appendMessage('Thinking...', 'ai');

    // Simulate AI response after a delay
    setTimeout(() => {
        const aiResponse = `I received your message: "${message}". What else can I help you with?`;
        uiElements.chatMessages.lastChild.textContent = aiResponse; // Update "Thinking..." message
        uiElements.chatMessages.lastChild.classList.remove('italic', 'text-purple-300'); // Remove thinking styles
        uiElements.chatMessages.scrollTop = uiElements.chatMessages.scrollHeight;
    }, 1500);
}