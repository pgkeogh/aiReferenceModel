import {
  vendors,
  products,
  capabilities,
  uiElements,
  selectedVendorId,
  selectedProductId,
  selectedCapabilityId,
  setSelectedVendorId,
  setSelectedProductId,
  setSelectedCapabilityId,
} from "./dataStore.js";
import { handleVendorSelection } from "./main.js"; // Import for re-rendering after data changes
import { openProductSelectionModal } from "./modals.js"; // Import for capability box click

/**
 * Renders the vendor selection dropdown.
 */
export function renderVendorSelector() {
  uiElements.vendorSelectElement.innerHTML =
    '<option value="">No Vendor Selected</option>';
  vendors.forEach((vendor) => {
    const option = document.createElement("option");
    option.value = vendor.id;
    option.textContent = vendor.name;
    uiElements.vendorSelectElement.appendChild(option);
  });
  // Reset selection to default (or set to first vendor if desired)
  uiElements.vendorSelectElement.value = "";
}

/**
 * Updates the display of product names within capability boxes that are already rendered.
 * This function does NOT create the capability boxes.
 */
export function updateCapabilityBoxProductDisplay() {
  capabilities.forEach((capability) => {
    const capabilityBox = document.querySelector(
      `[data-capability-id="${capability.id}"]`
    );
    if (capabilityBox) {
      const productNameDisplay = capabilityBox.querySelector(
        "[data-product-display]"
      );
      if (productNameDisplay) {
        const product = products.find(
          (p) => p.id === capability.currentProductId
        );
        productNameDisplay.textContent = product ? product.name : "N/A";
      }
    }
  });
}

/**
 * Dynamically renders ALL capability boxes into their respective containers.
 * This function CLEARS existing boxes and recreates them.
 */
export function renderAllCapabilityBoxes() {
  // Clear existing content in both containers
  uiElements.infrastructureDataCapabilitiesContainer.innerHTML = "";
  uiElements.aiPlatformCapabilitiesContainer.innerHTML = "";

  capabilities.forEach((capability) => {
    const capabilityBox = document.createElement("div");
    capabilityBox.id = capability.id; // Assign ID
    capabilityBox.dataset.capabilityId = capability.id; // Assign data attribute

    // Determine styling based on section
    let bgColor = "";
    let borderColor = "";
    let textColor = "";

    if (capability.section === "infrastructure") {
      bgColor = "bg-purple-800";
      borderColor = "border-purple-500";
      textColor = "text-purple-200";
    } else if (capability.section === "aiPlatform") {
      bgColor = "bg-blue-800";
      borderColor = "border-blue-500";
      textColor = "text-blue-200";
    }

    capabilityBox.className = `flex flex-col justify-center items-center p-2 rounded-lg text-center cursor-pointer transition-all duration-200 ease-in-out min-h-[60px] shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-md transform ${bgColor} border-2 ${borderColor} ${textColor} hover:${bgColor.replace(
      "800",
      "700"
    )}`;

    capabilityBox.innerHTML = `
            <span class="font-semibold">${capability.name}</span>
            <span class="text-sm font-semibold mt-1" data-product-display></span>
        `;

    // Append to the correct container
    if (capability.section === "infrastructure") {
      uiElements.infrastructureDataCapabilitiesContainer.appendChild(
        capabilityBox
      );
    } else if (capability.section === "aiPlatform") {
      // For AI Platform, we are appending directly. If you need specific grid rows/columns
      // for dynamically added capabilities, you would need to group them here
      // before appending to create the grid structure.
      uiElements.aiPlatformCapabilitiesContainer.appendChild(capabilityBox);
    }
  });

  // After rendering all boxes, update their product displays and attach listeners
  updateCapabilityBoxProductDisplay();
  attachCapabilityBoxListeners();
}

/**
 * Attaches event listeners to all capability boxes for modal interaction.
 * This should be called once after initial rendering and whenever capabilities might change.
 */
export function attachCapabilityBoxListeners() {
  document.querySelectorAll("[data-capability-id]").forEach((box) => {
    // Remove existing listener to prevent duplicates before adding a new one
    box.removeEventListener("click", handleCapabilityBoxClick);
    box.addEventListener("click", handleCapabilityBoxClick);
  });
}

function handleCapabilityBoxClick(e) {
  const box = e.currentTarget;
  // This check might be less critical now that boxes are dynamically rendered
  // but keep it as a safeguard if any header-like elements get data-capability-id accidentally.
  if (
    box.classList.contains("bg-purple-700") ||
    box.classList.contains("bg-blue-700")
  ) {
    // Removed bg-purple-800 as that is a capability box color
    return;
  }
  const capabilityId = box.dataset.capabilityId;
  openProductSelectionModal(capabilityId);
}

/**
 * Renders the vendor list in the data editor.
 */
export function renderVendorEditor() {
  uiElements.vendorNameInput.value = "";
  setSelectedVendorId(null);
  uiElements.vendorList.innerHTML = "";
  vendors.forEach((vendor) => {
    const vendorItem = document.createElement("div");
    vendorItem.className =
      "flex justify-between items-center p-2 border-b border-purple-700 hover:bg-purple-700 cursor-pointer transition-colors duration-150";
    vendorItem.textContent = vendor.name;
    vendorItem.dataset.id = vendor.id;
    vendorItem.addEventListener("click", () => {
      setSelectedVendorId(vendor.id);
      uiElements.vendorNameInput.value = vendor.name;
      Array.from(uiElements.vendorList.children).forEach((item) =>
        item.classList.remove("bg-purple-600", "border-purple-400")
      );
      vendorItem.classList.add("bg-purple-600", "border-purple-400");
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.className =
      "bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-500 transition-colors duration-200";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Call deleteVendor from dataEditor.js
      import("./dataEditor.js").then((module) =>
        module.deleteVendor(vendor.id)
      );
    });
    vendorItem.appendChild(deleteBtn);
    uiElements.vendorList.appendChild(vendorItem);
  });
}

/**
 * Renders the product list and related controls in the data editor.
 */
export function renderProductEditor() {
  uiElements.productNameInput.value = "";
  uiElements.productVendorSelect.innerHTML =
    '<option value="">Select Vendor</option>';
  vendors.forEach((vendor) => {
    const option = document.createElement("option");
    option.value = vendor.id;
    option.textContent = vendor.name;
    uiElements.productVendorSelect.appendChild(option);
  });
  uiElements.productVendorSelect.value = "";

  uiElements.productCapabilitiesCheckboxes.innerHTML = "";
  capabilities.forEach((capability) => {
    const div = document.createElement("div");
    div.className = "flex items-center space-x-1";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `product-cap-${capability.id}`;
    checkbox.value = capability.id;
    checkbox.className = "form-checkbox h-4 w-4 text-blue-400 rounded";
    const label = document.createElement("label");
    label.htmlFor = `product-cap-${capability.id}`;
    label.textContent = capability.name;
    label.className = "ml-1 text-purple-200";
    div.appendChild(checkbox);
    div.appendChild(label);
    uiElements.productCapabilitiesCheckboxes.appendChild(div);
  });

  setSelectedProductId(null);
  uiElements.productList.innerHTML = "";
  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.className =
      "flex justify-between items-center p-2 border-b border-purple-700 hover:bg-purple-700 cursor-pointer transition-colors duration-150";
    const vendor = vendors.find((v) => v.id === product.vendorId);
    productItem.innerHTML = `<span>${product.name} (${
      vendor ? vendor.name : "N/A"
    })</span>`;
    productItem.dataset.id = product.id;
    productItem.addEventListener("click", () => {
      setSelectedProductId(product.id);
      uiElements.productNameInput.value = product.name;
      uiElements.productVendorSelect.value = product.vendorId || "";
      Array.from(
        uiElements.productCapabilitiesCheckboxes.querySelectorAll(
          'input[type="checkbox"]'
        )
      ).forEach((cb) => {
        cb.checked = product.capabilityIds.includes(cb.value);
      });
      Array.from(uiElements.productList.children).forEach((item) =>
        item.classList.remove("bg-purple-600", "border-purple-400")
      );
      productItem.classList.add("bg-purple-600", "border-purple-400");
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.className =
      "bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-500 transition-colors duration-200";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Call deleteProduct from dataEditor.js
      import("./dataEditor.js").then((module) =>
        module.deleteProduct(product.id)
      );
    });
    productItem.appendChild(deleteBtn);
    uiElements.productList.appendChild(productItem);
  });
}

/**
 * Renders the capability list in the data editor.
 */
export function renderCapabilityEditor() {
  uiElements.capabilityNameInput.value = "";
  uiElements.capabilitySectionSelect.value = "infrastructure"; // Default
  setSelectedCapabilityId(null);
  uiElements.capabilityList.innerHTML = "";
  capabilities.forEach((capability) => {
    const capabilityItem = document.createElement("div");
    capabilityItem.className =
      "flex justify-between items-center p-2 border-b border-purple-700 hover:bg-purple-700 cursor-pointer transition-colors duration-150";
    capabilityItem.textContent = `${capability.name} (${capability.section})`;
    capabilityItem.dataset.id = capability.id;
    capabilityItem.addEventListener("click", () => {
      setSelectedCapabilityId(capability.id);
      uiElements.capabilityNameInput.value = capability.name;
      uiElements.capabilitySectionSelect.value = capability.section;
      Array.from(uiElements.capabilityList.children).forEach((item) =>
        item.classList.remove("bg-purple-600", "border-purple-400")
      );
      capabilityItem.classList.add("bg-purple-600", "border-purple-400");
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.className =
      "bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-500 transition-colors duration-200";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Call deleteCapability from dataEditor.js
      import("./dataEditor.js").then((module) =>
        module.deleteCapability(capability.id)
      );
    });
    capabilityItem.appendChild(deleteBtn);
    uiElements.capabilityList.appendChild(capabilityItem);
  });
}
