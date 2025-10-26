import { uiElements, vendors, products, capabilities } from "./dataStore.js";
import { loadData } from "./csvHandler.js"; // UPDATED IMPORT HERE
import { openDataEditorModal } from "./modals.js";
import {
  renderVendorSelector,
  renderAllCapabilityBoxes,
  attachCapabilityBoxListeners,
  updateCapabilityBoxProductDisplay,
} from "./uiRenderer.js";
// import { addChatMessage } from './chatbot.js'; // Commented out to prevent errors until chatbot.js is ready

/**
 * Handles vendor selection, assigning products to capabilities based on the selected vendor
 * or falling back to "Cloud Native" if no vendor-specific product is found.
 */
export function handleVendorSelection() {
  const selectedVendorId = uiElements.vendorSelectElement.value;

  // Clear all current product selections first
  capabilities.forEach((c) => (c.currentProductId = null));

  // Identify the Cloud Native vendor and product
  const cloudNativeVendor = vendors.find((v) => v.name === "Cloud Native");
  const cloudNativeProductId = cloudNativeVendor
    ? products.find(
        (p) =>
          p.vendorId === cloudNativeVendor.id &&
          p.name === "Cloud Native Base Services"
      )?.id
    : null;

  capabilities.forEach((capability) => {
    let assignedProductId = null;

    // 1. Try to find a product from the selected vendor
    if (selectedVendorId) {
      const vendorProducts = products.filter(
        (p) => p.vendorId === selectedVendorId
      );
      const matchingProduct = vendorProducts.find((p) =>
        p.capabilityIds.includes(capability.id)
      );
      if (matchingProduct) {
        assignedProductId = matchingProduct.id;
      }
    }

    // 2. If no product from the selected vendor, try the "Cloud Native" product
    if (!assignedProductId && cloudNativeProductId) {
      const cnProduct = products.find((p) => p.id === cloudNativeProductId);
      if (cnProduct && cnProduct.capabilityIds.includes(capability.id)) {
        assignedProductId = cloudNativeProductId;
      }
    }

    // 3. Assign the found product, or keep null if none found
    capability.currentProductId = assignedProductId;
  });
  updateCapabilityBoxProductDisplay(); // Call the update function, not renderAllCapabilityBoxes
}

// --- Event Listeners ---

document.addEventListener("DOMContentLoaded", async () => {
  await loadData(); // UPDATED CALL HERE
  renderVendorSelector(); // Renders the vendor dropdown
  renderAllCapabilityBoxes(); // Call this to render all capability boxes initially
  handleVendorSelection(); // This will then update product names within the rendered boxes
  // attachCapabilityBoxListeners() is now called within renderAllCapabilityBoxes
});

uiElements.vendorSelectElement.addEventListener(
  "change",
  handleVendorSelection
);

uiElements.manageDataButton.addEventListener("click", openDataEditorModal);

// Chatbot functionality (commented out until chatbot.js is fully implemented)
uiElements.sendChatButton.addEventListener("click", () => {
  const message = uiElements.chatInput.value.trim();
  if (message) {
    // addChatMessage('user', message); // Commented out
    uiElements.chatInput.value = "";
    // Here you would integrate with your AI model
    // For now, let's simulate a simple AI response
    setTimeout(() => {
      // addChatMessage('ai', `You asked: "${message}". I'm still learning, but I can help you visualize your AI platform and data model!`); // Commented out
    }, 1000);
  }
});

uiElements.chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    uiElements.sendChatButton.click();
  }
});
