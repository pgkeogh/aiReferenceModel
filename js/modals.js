// js/modals.js

// IMPORTANT: Only import uiElements, do NOT declare it again in this file.
import { uiElements } from "./main.js"; // uiElements is exported from main.js
import { capabilities, products } from "./dataStore.js"; // Data arrays needed for modal logic
import { updateCapabilityBoxProductDisplay } from "./uiRenderer.js"; // Function to update UI after product selection

// Internal state for the product selection modal
let currentModalCapabilityId = null;

function setCurrentModalCapabilityId(id) {
  currentModalCapabilityId = id;
}

/**
 * Opens the data editor modal with transitions.
 */
export function openDataEditorModal() {
  // Add a safety check for uiElements and its properties
  if (!uiElements.mainAppContainer || !uiElements.dataEditorContainer) {
    console.error(
      "Error: Required UI elements (mainAppContainer or dataEditorContainer) not initialized in uiElements."
    );
    return; // Exit if critical elements are missing
  }

  // Hide main app with transition
  uiElements.mainAppContainer.classList.remove("opacity-100", "translate-y-0");
  uiElements.mainAppContainer.classList.add(
    "opacity-0",
    "-translate-y-4",
    "pointer-events-none"
  );

  // Show data editor with transition after a slight delay
  setTimeout(() => {
    // Ensure dataEditorContainer is not hidden before applying transition classes
    uiElements.dataEditorContainer.classList.remove("hidden");

    uiElements.dataEditorContainer.classList.remove(
      "opacity-0",
      "pointer-events-none"
    );
    uiElements.dataEditorContainer.classList.add(
      "opacity-100",
      "pointer-events-auto"
    );

    // Check if the first child div exists before trying to access its classList
    const firstDivInModal =
      uiElements.dataEditorContainer.querySelector("div:first-of-type");
    if (firstDivInModal) {
      firstDivInModal.classList.remove("scale-95");
      firstDivInModal.classList.add("scale-100");
    }

    // Render editors after modal is open
    // Dynamically import uiRenderer functions
    import("./uiRenderer.js").then((module) => {
      module.renderVendorEditor();
      module.renderProductEditor();
      module.renderCapabilityEditor();
    });
  }, 300); // Match transition duration for hiding main app
}

/**
 * Closes the data editor modal with transitions.
 */
export function closeDataEditorModal() {
  if (uiElements.dataEditorContainer) {
    // Hide the modal with transition
    uiElements.dataEditorContainer.classList.remove(
      "opacity-100",
      "pointer-events-auto"
    );
    uiElements.dataEditorContainer.classList.add(
      "opacity-0",
      "pointer-events-none"
    );

    // Scale down the inner content
    const firstDivInModal =
      uiElements.dataEditorContainer.querySelector("div:first-of-type");
    if (firstDivInModal) {
      firstDivInModal.classList.remove("scale-100");
      firstDivInModal.classList.add("scale-95");
    }

    // Re-show main app with transition after a slight delay
    setTimeout(() => {
      if (uiElements.mainAppContainer) {
        uiElements.mainAppContainer.classList.remove(
          "opacity-0",
          "-translate-y-4",
          "pointer-events-none"
        );
        uiElements.mainAppContainer.classList.add(
          "opacity-100",
          "translate-y-0"
        );
      }
      // Add 'hidden' after transitions complete to fully remove from layout flow
      uiElements.dataEditorContainer.classList.add("hidden");
    }, 300); // Match transition duration
  } else {
    console.error(
      "Error: Data Editor Modal element not found in uiElements for closing!"
    );
  }
}

/**
 * Opens the product selection modal for a given capability.
 * @param {string} capabilityId - The ID of the capability to select a product for.
 */
export function openProductSelectionModal(capabilityId) {
  // Safety check for uiElements before proceeding
  if (
    !uiElements.productSelectionModal ||
    !uiElements.modalCapabilityName ||
    !uiElements.modalProductList
  ) {
    console.error(
      "Error: Required UI elements for Product Selection Modal not initialized in uiElements."
    );
    return;
  }

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

  // Ensure modal is not hidden before applying transition classes
  uiElements.productSelectionModal.classList.remove("hidden");

  // Show modal with transition
  uiElements.productSelectionModal.classList.remove(
    "opacity-0",
    "pointer-events-none"
  );
  uiElements.productSelectionModal.classList.add(
    "opacity-100",
    "pointer-events-auto"
  );
  // Check existence of inner div
  const productModalInnerDiv =
    uiElements.productSelectionModal.querySelector("div:first-of-type");
  if (productModalInnerDiv) {
    productModalInnerDiv.classList.remove("scale-95");
    productModalInnerDiv.classList.add("scale-100");
  }
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
  if (!uiElements.productSelectionModal) {
    console.error(
      "Error: Product Selection Modal element not initialized in uiElements for closing!"
    );
    return;
  }

  uiElements.productSelectionModal.classList.remove(
    "opacity-100",
    "pointer-events-auto"
  );
  uiElements.productSelectionModal.classList.add(
    "opacity-0",
    "pointer-events-none"
  );

  // Scale down the inner content
  const productModalInnerDiv =
    uiElements.productSelectionModal.querySelector("div:first-of-type");
  if (productModalInnerDiv) {
    productModalInnerDiv.classList.remove("scale-100");
    productModalInnerDiv.classList.add("scale-95");
  }

  // Add 'hidden' after transitions complete
  setTimeout(() => {
    uiElements.productSelectionModal.classList.add("hidden");
  }, 300); // Match transition duration

  setCurrentModalCapabilityId(null); // Clear the active capability ID
}
