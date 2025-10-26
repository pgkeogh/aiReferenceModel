// js/uiRenderer.js
// Version: 2023-10-27_14 - Added detailed rendering logs

import { uiElements } from "./main.js";
import { capabilities, products, vendors } from "./dataStore.js";
import { openProductSelectionModal } from "./modals.js";

/**
 * Renders all capability boxes into their respective containers (Data Layer, AI Layer)
 * based on their 'category', 'section', and 'order' properties.
 */
export function renderAllCapabilityBoxes() {
  const dataContainer = uiElements.infrastructureDataCapabilitiesContainer;
  const aiContainer = uiElements.aiPlatformCapabilitiesContainer;

  if (!dataContainer || !aiContainer) {
    console.error(
      "UI_RENDERER: One or more capability containers not found in uiElements. Check main.js and index.html."
    );
    return;
  }

  dataContainer.innerHTML = "";
  aiContainer.innerHTML = "";

  const dataLayerCaps = capabilities.filter((c) => c.category === "Data Layer");
  const aiLayerCaps = capabilities.filter((c) => c.category === "AI Layer");

  console.log(
    "UI_RENDERER: Rendering Data Layer Capabilities:",
    dataLayerCaps.map((c) => c.name)
  );
  if (dataContainer) {
    dataLayerCaps
      .sort((a, b) => a.order - b.order)
      .forEach((capability) => {
        const capabilityBox = createCapabilityBox(capability);
        dataContainer.appendChild(capabilityBox);
      });
  }

  console.log(
    "UI_RENDERER: Rendering AI Layer Capabilities:",
    aiLayerCaps.map((c) => c.name)
  );
  if (aiContainer) {
    const aiSections = {};
    aiLayerCaps.forEach((cap) => {
      if (!aiSections[cap.section]) {
        aiSections[cap.section] = [];
      }
      aiSections[cap.section].push(cap);
    });

    const sectionOrder = [
      "AI Layer - Top",
      "AI Layer - UI",
      "AI Layer - Governance",
      "AI Layer - Operations",
      "AI Layer - Standards",
      "AI Layer - Models",
      "AI Layer - Deployment",
    ];

    sectionOrder.forEach((sectionName) => {
      const sectionCaps = aiSections[sectionName];
      if (sectionCaps && sectionCaps.length > 0) {
        if (sectionCaps[0].isLabel) {
          const labelDiv = document.createElement("div");
          labelDiv.className = `p-2 rounded-md text-center text-purple-200 font-semibold text-lg py-3
                                         ${
                                           sectionCaps[0].borderColorClass ||
                                           "border-purple-700"
                                         } border-2 bg-purple-800 shadow-md mb-4`;
          labelDiv.textContent = sectionCaps[0].name;
          aiContainer.appendChild(labelDiv);
          console.log(
            `UI_RENDERER: Appended label: "${sectionCaps[0].name}" to AI container.`
          );
        } else {
          const rowDiv = document.createElement("div");
          rowDiv.className = "flex flex-wrap gap-4 mb-4";

          sectionCaps
            .sort((a, b) => a.order - b.order)
            .forEach((capability) => {
              const capabilityBox = createCapabilityBox(capability);
              rowDiv.appendChild(capabilityBox);
              console.log(
                `UI_RENDERER: Appended capability box for "${capability.name}" to AI section "${sectionName}".`
              );
            });
          aiContainer.appendChild(rowDiv);
        }
      }
    });
  }
}

function createCapabilityBox(capability) {
  const box = document.createElement("div");
  box.className = `flex-1 flex flex-col justify-between p-4 rounded-lg shadow-md min-h-[100px] cursor-pointer
                     transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1
                     ${
                       capability.borderColorClass || "border-purple-700"
                     } border-2 bg-purple-800 text-purple-100`;
  box.dataset.capabilityId = capability.id;

  const capabilityName = document.createElement("h3");
  capabilityName.className = "font-semibold text-lg mb-2";
  capabilityName.textContent = capability.name;
  box.appendChild(capabilityName);

  const productName = document.createElement("p");
  productName.className = "text-sm text-purple-300 italic";
  productName.id = `product-name-${capability.id}`;
  box.appendChild(productName);

  box.addEventListener("click", () => openProductSelectionModal(capability.id));

  console.log(
    `UI_RENDERER: Created capability box for "${capability.name}" with product name ID "${productName.id}"`
  );
  return box;
}

export function updateCapabilityBoxProductDisplay() {
  console.log("UI_RENDERER: Starting updateCapabilityBoxProductDisplay...");
  capabilities.forEach((capability) => {
    const productNameElement = document.getElementById(
      `product-name-${capability.id}`
    );
    if (productNameElement) {
      if (capability.currentProductId) {
        const product = products.find(
          (p) => p.id === capability.currentProductId
        );
        const displayText = product
          ? `Product: ${product.name}`
          : "No Product Assigned (Product not found)";
        productNameElement.textContent = displayText;
        console.log(
          `UI_RENDERER: Updated capability "${capability.name}" (${capability.id}) with product text: "${displayText}"`
        );
      } else {
        productNameElement.textContent = "No Product Assigned";
        console.log(
          `UI_RENDERER: Updated capability "${capability.name}" (${capability.id}) with text: "No Product Assigned"`
        );
      }
    } else {
      console.warn(
        `UI_RENDERER: Could not find product name element for capability ID: ${capability.id}`
      );
    }
  });
  console.log("UI_RENDERER: Finished updateCapabilityBoxProductDisplay.");
}

export function renderVendorSelector() {
  if (!uiElements.vendorSelectElement) {
    console.error("UI_RENDERER: Vendor select element not found.");
    return;
  }
  uiElements.vendorSelectElement.innerHTML =
    '<option value="">No Vendor Selected</option>';
  vendors.forEach((vendor) => {
    const option = document.createElement("option");
    option.value = vendor.id;
    option.textContent = vendor.name;
    uiElements.vendorSelectElement.appendChild(option);
  });
  console.log("UI_RENDERER: Vendor selector rendered.");
}

export function renderVendorEditor() {
  const vendorListDiv = uiElements.vendorList;
  if (!vendorListDiv) {
    console.error(
      "UI_RENDERER: Vendor list container not found in data editor."
    );
    return;
  }
  vendorListDiv.innerHTML = "";
  vendors.forEach((vendor) => {
    const item = document.createElement("div");
    item.className =
      "p-2 border-b border-purple-700 hover:bg-purple-700 cursor-pointer";
    item.textContent = vendor.name;
    item.dataset.vendorId = vendor.id;
    vendorListDiv.appendChild(item);
  });
  const productVendorSelect = uiElements.productVendorSelect;
  if (productVendorSelect) {
    productVendorSelect.innerHTML = '<option value="">Select Vendor</option>';
    vendors.forEach((vendor) => {
      const option = document.createElement("option");
      option.value = vendor.id;
      option.textContent = vendor.name;
      productVendorSelect.appendChild(option);
    });
  }
  console.log("UI_RENDERER: Vendor editor rendered.");
}

export function renderProductEditor() {
  const productListDiv = uiElements.productList;
  if (!productListDiv) {
    console.error(
      "UI_RENDERER: Product list container not found in data editor."
    );
    return;
  }
  productListDiv.innerHTML = "";
  products.forEach((product) => {
    const item = document.createElement("div");
    item.className =
      "p-2 border-b border-purple-700 hover:bg-purple-700 cursor-pointer";
    const vendor = vendors.find((v) => v.id === product.vendorId);
    item.textContent = `${product.name} (${vendor ? vendor.name : "N/A"})`;
    item.dataset.productId = product.id;
    productListDiv.appendChild(item);
  });

  const productCapabilitiesCheckboxes =
    uiElements.productCapabilitiesCheckboxes;
  if (productCapabilitiesCheckboxes) {
    productCapabilitiesCheckboxes.innerHTML = "";
    capabilities.forEach((cap) => {
      if (!cap.isLabel) {
        const label = document.createElement("label");
        label.className = "flex items-center space-x-2 text-purple-200";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = cap.id;
        checkbox.className = "form-checkbox text-blue-600 rounded";
        label.appendChild(checkbox);
        label.append(cap.name);
        productCapabilitiesCheckboxes.appendChild(label);
      }
    });
  }
  console.log("UI_RENDERER: Product editor rendered.");
}

export function renderCapabilityEditor() {
  const capabilityListDiv = uiElements.capabilityList;
  if (!capabilityListDiv) {
    console.error(
      "UI_RENDERER: Capability list container not found in data editor."
    );
    return;
  }
  capabilityListDiv.innerHTML = "";
  capabilities.forEach((capability) => {
    const item = document.createElement("div");
    item.className =
      "p-2 border-b border-purple-700 hover:bg-purple-700 cursor-pointer";
    item.textContent = `${capability.name} (${capability.category})`;
    item.dataset.capabilityId = capability.id;
    capabilityListDiv.appendChild(item);
  });
  console.log("UI_RENDERER: Capability editor rendered.");
}
