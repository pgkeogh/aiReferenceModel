import {
  capabilities,
  products,
  uiElements,
  currentModalCapabilityId,
  setCurrentModalCapabilityId,
} from "./dataStore.js";
import {
  renderAllCapabilityBoxes,
  updateCapabilityBoxProductDisplay,
} from "./uiRenderer.js";
import { handleVendorSelection } from "./main.js"; // For re-applying vendor selection logic
import { saveData } from "./csvHandler.js"; // UPDATED IMPORT HERE

/**
 * Opens the product selection modal for a given capability.
 * @param {string} capabilityId - The ID of the capability to select a product for.
 */
export function openProductSelectionModal(capabilityId) {
  setCurrentModalCapabilityId(capabilityId);
  const capability = capabilities.find((c) => c.id === capabilityId);
  if (!capability) return;

  uiElements.modalCapabilityName.textContent = capability.name;
  uiElements.modalProductList.innerHTML = "";

  const productsForCapability = products.filter((p) =>
    p.capabilityIds.includes(capabilityId)
  );

  if (productsForCapability.length === 0) {
    uiElements.modalProductList.innerHTML =
      '<p class="text-purple-300">No products offer this capability.</p>';
  } else {
    productsForCapability.forEach((product) => {
      const productItem = document.createElement("div");
      const isSelected = capability.currentProductId === product.id;
      productItem.className = `p-2 border border-purple-700 rounded-md cursor-pointer hover:bg-purple-700 transition-colors duration-150 ${
        isSelected ? "bg-purple-600 border-purple-400" : ""
      }`;
      productItem.textContent = product.name;
      productItem.dataset.productId = product.id;
      productItem.addEventListener("click", () =>
        selectProductForCapability(capabilityId, product.id)
      );
      uiElements.modalProductList.appendChild(productItem);
    });
  }

  // Show modal with transition
  uiElements.productSelectionModal.classList.remove(
    "opacity-0",
    "pointer-events-none"
  );
  uiElements.productSelectionModal.classList.add(
    "opacity-100",
    "pointer-events-auto"
  );
  uiElements.productSelectionModal
    .querySelector("div:first-of-type")
    .classList.remove("scale-95");
  uiElements.productSelectionModal
    .querySelector("div:first-of-type")
    .classList.add("scale-100");
}

/**
 * Selects a product for a specific capability and closes the modal.
 * @param {string} capabilityId - The ID of the capability.
 * @param {string} productId - The ID of the product to select.
 */
export function selectProductForCapability(capabilityId, productId) {
  const capability = capabilities.find((c) => c.id === capabilityId);
  if (capability) {
    capability.currentProductId = productId;
    updateCapabilityBoxProductDisplay(); // Re-render to show updated product
    closeProductSelectionModal(); // Close modal
  }
}

/**
 * Clears the selected product for the currently active capability.
 */
export function clearSelectedProductForCapability() {
  if (currentModalCapabilityId) {
    const capability = capabilities.find(
      (c) => c.id === currentModalCapabilityId
    );
    if (capability) {
      capability.currentProductId = null;
      updateCapabilityBoxProductDisplay();
      closeProductSelectionModal();
    }
  }
}

/**
 * Closes the product selection modal with a transition.
 */
export function closeProductSelectionModal() {
  uiElements.productSelectionModal.classList.remove(
    "opacity-100",
    "pointer-events-auto"
  );
  uiElements.productSelectionModal.classList.add(
    "opacity-0",
    "pointer-events-none"
  );
  uiElements.productSelectionModal
    .querySelector("div:first-of-type")
    .classList.remove("scale-100");
  uiElements.productSelectionModal
    .querySelector("div:first-of-type")
    .classList.add("scale-95");
  setCurrentModalCapabilityId(null); // Clear the active capability ID
}

/**
 * Opens the data editor modal with a transition.
 */
export function openDataEditorModal() {
  // Hide main app with transition
  uiElements.mainAppContainer.classList.remove("opacity-100", "translate-y-0");
  uiElements.mainAppContainer.classList.add(
    "opacity-0",
    "-translate-y-4",
    "pointer-events-none"
  );

  // Show data editor with transition after a slight delay
  setTimeout(() => {
    uiElements.dataEditorContainer.classList.remove(
      "opacity-0",
      "pointer-events-none"
    );
    uiElements.dataEditorContainer.classList.add(
      "opacity-100",
      "pointer-events-auto"
    );
    uiElements.dataEditorContainer
      .querySelector("div:first-of-type")
      .classList.remove("scale-95");
    uiElements.dataEditorContainer
      .querySelector("div:first-of-type")
      .classList.add("scale-100");
    // Render editors after modal is open
    import("./uiRenderer.js").then((module) => {
      module.renderVendorEditor();
      module.renderProductEditor();
      module.renderCapabilityEditor();
    });
  }, 300); // Match transition duration
}

/**
 * Closes the data editor modal with a transition.
 * @param {boolean} shouldSave - Whether to save data before closing.
 */
export async function closeDataEditorModal(shouldSave) {
  if (shouldSave) {
    saveData(); // UPDATED CALL HERE
  }

  // Hide data editor with transition
  uiElements.dataEditorContainer.classList.remove(
    "opacity-100",
    "pointer-events-auto"
  );
  uiElements.dataEditorContainer.classList.add(
    "opacity-0",
    "pointer-events-none"
  );
  uiElements.dataEditorContainer
    .querySelector("div:first-of-type")
    .classList.remove("scale-100");
  uiElements.dataEditorContainer
    .querySelector("div:first-of-type")
    .classList.add("scale-95");

  // Show main app with transition after a slight delay
  setTimeout(() => {
    uiElements.mainAppContainer.classList.remove(
      "opacity-0",
      "-translate-y-4",
      "pointer-events-none"
    );
    uiElements.mainAppContainer.classList.add("opacity-100", "translate-y-0");
    // Re-initialize main app view after data changes
    import("./uiRenderer.js").then((module) => {
      module.renderVendorSelector();
      module.renderAllCapabilityBoxes();
    });
    handleVendorSelection(); // Re-apply current vendor selection (this will call updateCapabilityBoxProductDisplay)
  }, 300); // Match transition duration
}

// Event listeners for the product selection modal close buttons
// These are attached directly to the UI elements once the DOM is ready.
document.addEventListener("DOMContentLoaded", () => {
  uiElements.closeProductModalButton.addEventListener(
    "click",
    closeProductSelectionModal
  );
  uiElements.closeProductModalButtonAlt.addEventListener(
    "click",
    closeProductSelectionModal
  );
  uiElements.clearProductSelectionButton.addEventListener(
    "click",
    clearSelectedProductForCapability
  );
});
