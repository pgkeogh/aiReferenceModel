// js/main.js
// Version: 2023-10-27_14 - Added detailed vendor product filtering logs

import { vendors, products, capabilities } from "./dataStore.js";
import { loadData } from "./csvHandler.js";
import {
  openDataEditorModal,
  closeDataEditorModal,
  closeProductSelectionModal,
  clearSelectedProductForCapability,
} from "./modals.js";
import {
  renderVendorSelector,
  renderAllCapabilityBoxes,
  updateCapabilityBoxProductDisplay,
  renderVendorEditor,
  renderProductEditor,
  renderCapabilityEditor,
} from "./uiRenderer.js";
import { initializeDataEditorListeners } from "./dataEditor.js";

export const uiElements = {};

/**
 * Handles vendor selection, assigning products to capabilities based on the selected vendor
 * or falling back to Cloud Native Base Services.
 */
export function handleVendorSelection() {
  console.log("MAIN_JS: handleVendorSelection called.");
  if (!uiElements.vendorSelectElement) {
    console.error(
      "MAIN_JS: Error: uiElements.vendorSelectElement is null. Vendor selector not found or initialized."
    );
    return;
  }
  const selectedVendorId = uiElements.vendorSelectElement.value;
  console.log("MAIN_JS: Selected Vendor ID:", selectedVendorId);
  console.log(
    "MAIN_JS: Current state of ALL products before assignment:",
    products
  );
  console.log(
    "MAIN_JS: Current state of ALL capabilities before assignment:",
    capabilities
  );

  const cloudNativeBaseProduct = products.find(
    (p) => p.name === "Cloud Native Base Services"
  );
  if (cloudNativeBaseProduct) {
    if (!cloudNativeBaseProduct.vendorId) {
      const cloudNativeVendor = vendors.find(
        (v) => v.name.toLowerCase().trim() === "cloudnative"
      );
      if (cloudNativeVendor) {
        cloudNativeBaseProduct.vendorId = cloudNativeVendor.id;
        console.warn(
          "MAIN_JS: Cloud Native Base Services product had missing vendorId, assigned now:",
          cloudNativeBaseProduct.vendorId
        );
      } else {
        console.warn(
          "MAIN_JS: Cloud Native vendor 'CloudNative' not found in vendors list. Cannot assign vendorId to Cloud Native Base Services product. Check vendors.csv."
        );
      }
    }
    console.log(
      "MAIN_JS: Found Cloud Native Base Product:",
      cloudNativeBaseProduct
    );
  } else {
    console.warn(
      "MAIN_JS: Cloud Native Base Services product not found. Fallback logic may not apply."
    );
  }

  capabilities.forEach((capability) => {
    if (capability.isLabel) {
      console.log(`MAIN_JS: Skipping label capability: ${capability.name}`);
      return;
    }

    let assignedProductId = null;

    // 1. Attempt to find a product from the CURRENTLY SELECTED VENDOR
    if (selectedVendorId) {
      const vendorProducts = products.filter(
        (p) => p.vendorId === selectedVendorId
      );
      console.log(
        `MAIN_JS: For selected vendor ID "${selectedVendorId}", found products:`,
        vendorProducts.map((p) => p.name)
      ); // <--- NEW KEY LOG

      const matchingProduct = vendorProducts.find(
        (p) => p.capabilityIds && p.capabilityIds.includes(capability.id)
      );
      if (matchingProduct) {
        assignedProductId = matchingProduct.id;
        console.log(
          `MAIN_JS: Capability "${capability.name}" (${capability.id}) assigned product "${matchingProduct.name}" from selected vendor.`
        );
      } else {
        console.log(
          `MAIN_JS: For capability "${capability.name}", no matching product found from selected vendor "${selectedVendorId}".`
        ); // <--- NEW KEY LOG
      }
    }

    // 2. If no product was found from the SELECTED VENDOR,
    //    then try the Cloud Native Base Services product as a fallback.
    if (!assignedProductId && cloudNativeBaseProduct) {
      if (
        cloudNativeBaseProduct.capabilityIds &&
        cloudNativeBaseProduct.capabilityIds.includes(capability.id)
      ) {
        assignedProductId = cloudNativeBaseProduct.id;
        console.log(
          `MAIN_JS: Capability "${capability.name}" (${capability.id}) assigned Cloud Native Base Services as fallback.`
        );
      }
    }

    capability.currentProductId = assignedProductId;
    if (!assignedProductId) {
      console.log(
        `MAIN_JS: Capability "${capability.name}" (${capability.id}) remains unassigned.`
      );
    }
  });

  console.log(
    "MAIN_JS: Final state of capabilities AFTER assignment logic:",
    capabilities.map((c) => ({
      id: c.id,
      name: c.name,
      currentProductId: c.currentProductId,
    }))
  );
  updateCapabilityBoxProductDisplay();
}

document.addEventListener("DOMContentLoaded", async () => {
  uiElements.mainAppContainer = document.getElementById("main-app-content");
  uiElements.dataEditorContainer = document.getElementById(
    "data-editor-container"
  );
  uiElements.productSelectionModal = document.getElementById(
    "product-selection-modal"
  );
  uiElements.modalCapabilityName = document.getElementById(
    "modal-capability-name"
  );
  uiElements.modalProductList = document.getElementById("modal-product-list");

  uiElements.vendorSelectElement = document.getElementById("vendor-select");
  uiElements.manageDataButton = document.getElementById("manage-data-button");
  uiElements.saveCloseDataEditorButton = document.getElementById(
    "save-close-data-editor"
  );

  uiElements.closeProductModalX = document.getElementById(
    "close-product-modal"
  );
  uiElements.closeProductModalButton = document.getElementById(
    "close-product-modal-button"
  );
  uiElements.clearProductSelectionButton = document.getElementById(
    "clear-product-selection"
  );

  uiElements.chatInput = document.getElementById("chat-input");
  uiElements.sendChatButton = document.getElementById("send-chat-button");

  uiElements.vendorNameInput = document.getElementById("vendor-name-input");
  uiElements.addVendorButton = document.getElementById("add-vendor-button");
  uiElements.editVendorButton = document.getElementById("edit-vendor-button");
  uiElements.deleteVendorButton = document.getElementById(
    "delete-vendor-button"
  );
  uiElements.vendorList = document.getElementById("vendor-list");
  uiElements.productNameInput = document.getElementById("product-name-input");
  uiElements.productVendorSelect = document.getElementById(
    "product-vendor-select"
  );
  uiElements.productCapabilitiesCheckboxes = document.getElementById(
    "product-capabilities-checkboxes"
  );
  uiElements.addProductButton = document.getElementById("add-product-button");
  uiElements.editProductButton = document.getElementById("edit-product-button");
  uiElements.deleteProductButton = document.getElementById(
    "delete-product-button"
  );
  uiElements.productList = document.getElementById("product-list");
  uiElements.capabilityNameInput = document.getElementById(
    "capability-name-input"
  );
  uiElements.capabilitySectionSelect = document.getElementById(
    "capability-section-select"
  );
  uiElements.addCapabilityButton = document.getElementById(
    "add-capability-button"
  );
  uiElements.editCapabilityButton = document.getElementById(
    "edit-capability-button"
  );
  uiElements.deleteCapabilityButton = document.getElementById(
    "delete-capability-button"
  );
  uiElements.capabilityList = document.getElementById("capability-list");
  uiElements.chatMessages = document.getElementById("chat-messages");

  uiElements.infrastructureDataCapabilitiesContainer = document.getElementById(
    "infrastructure-data-capabilities-container"
  );
  uiElements.aiPlatformCapabilitiesContainer = document.getElementById(
    "ai-platform-capabilities-container"
  );

  if (!uiElements.vendorSelectElement) {
    console.error(
      "MAIN_JS: Error: Vendor selector element (id='vendor-select') not found in the DOM. Please check your index.html."
    );
    return;
  }

  await loadData();

  renderVendorSelector();
  renderAllCapabilityBoxes();

  setTimeout(() => {
    handleVendorSelection();
  }, 0); // Initial call to populate on load

  if (uiElements.vendorSelectElement) {
    uiElements.vendorSelectElement.addEventListener(
      "change",
      handleVendorSelection
    );
  }

  if (uiElements.manageDataButton) {
    uiElements.manageDataButton.addEventListener("click", openDataEditorModal);
  }

  if (uiElements.saveCloseDataEditorButton) {
    uiElements.saveCloseDataEditorButton.addEventListener("click", () => {
      console.log(
        "MAIN_JS: Save & Close Data Editor button clicked - implement save logic here."
      );
      closeDataEditorModal();
    });
  }

  if (uiElements.closeProductModalX) {
    uiElements.closeProductModalX.addEventListener(
      "click",
      closeProductSelectionModal
    );
  }
  if (uiElements.closeProductModalButton) {
    uiElements.closeProductModalButton.addEventListener(
      "click",
      closeProductSelectionModal
    );
  }
  if (uiElements.clearProductSelectionButton) {
    uiElements.clearProductSelectionButton.addEventListener(
      "click",
      clearSelectedProductForCapability
    );
  }

  if (uiElements.sendChatButton) {
    uiElements.sendChatButton.addEventListener("click", () => {
      const message = uiElements.chatInput.value.trim();
      if (message) {
        uiElements.chatInput.value = "";
        console.log("MAIN_JS: Chat message sent:", message);
        setTimeout(() => {}, 1000);
      }
    });
  }

  if (uiElements.chatInput) {
    uiElements.chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        uiElements.sendChatButton.click();
      }
    });
  }

  initializeDataEditorListeners();
});
