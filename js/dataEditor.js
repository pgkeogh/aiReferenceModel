// js/dataEditor.js
// Version: 2023-10-27_10 - Removed Source Systems section option

import { uiElements } from "./main.js";
import {
  vendors,
  products,
  capabilities,
  setVendors,
  setProducts,
  setCapabilities,
  generateUniqueId,
  setSelectedVendorId,
  setSelectedProductId,
  setSelectedCapabilityId,
  selectedVendorId,
  selectedProductId,
  selectedCapabilityId,
} from "./dataStore.js";
import {
  renderVendorEditor,
  renderProductEditor,
  renderCapabilityEditor,
} from "./uiRenderer.js";
import { handleVendorSelection } from "./main.js";

export function initializeDataEditorListeners() {
  // --- Vendor Management ---
  if (uiElements.addVendorButton) {
    uiElements.addVendorButton.addEventListener("click", () => {
      const name = uiElements.vendorNameInput.value.trim();
      if (name) {
        const newVendor = { id: generateUniqueId(), name };
        setVendors([...vendors, newVendor]);
        renderVendorEditor();
        uiElements.vendorNameInput.value = "";
        handleVendorSelection();
      }
    });
  }

  if (uiElements.editVendorButton) {
    uiElements.editVendorButton.addEventListener("click", () => {
      if (selectedVendorId) {
        const name = uiElements.vendorNameInput.value.trim();
        if (name) {
          setVendors(
            vendors.map((v) => (v.id === selectedVendorId ? { ...v, name } : v))
          );
          renderVendorEditor();
          uiElements.vendorNameInput.value = "";
          setSelectedVendorId(null);
          handleVendorSelection();
        }
      } else {
        alert("Please select a vendor to edit.");
      }
    });
  }

  if (uiElements.deleteVendorButton) {
    uiElements.deleteVendorButton.addEventListener("click", () => {
      if (selectedVendorId) {
        if (
          confirm(
            "Are you sure you want to delete this vendor? This will also remove associated products."
          )
        ) {
          setVendors(vendors.filter((v) => v.id !== selectedVendorId));
          setProducts(products.filter((p) => p.vendorId !== selectedVendorId));
          renderVendorEditor();
          renderProductEditor();
          uiElements.vendorNameInput.value = "";
          setSelectedVendorId(null);
          handleVendorSelection();
        }
      } else {
        alert("Please select a vendor to delete.");
      }
    });
  }

  if (uiElements.vendorList) {
    uiElements.vendorList.addEventListener("click", (e) => {
      const target = e.target.closest("div[data-vendor-id]");
      if (target) {
        const id = target.dataset.vendorId;
        setSelectedVendorId(id);
        const vendor = vendors.find((v) => v.id === id);
        if (vendor) {
          uiElements.vendorNameInput.value = vendor.name;
        }
        Array.from(uiElements.vendorList.children).forEach((child) => {
          child.classList.remove("bg-purple-600");
        });
        target.classList.add("bg-purple-600");
      }
    });
  }

  // --- Product Management ---
  if (uiElements.addProductButton) {
    uiElements.addProductButton.addEventListener("click", () => {
      const name = uiElements.productNameInput.value.trim();
      const vendorId = uiElements.productVendorSelect.value;
      const capabilityIds = Array.from(
        uiElements.productCapabilitiesCheckboxes.querySelectorAll(
          "input:checked"
        )
      ).map((cb) => cb.value);

      if (name && vendorId && capabilityIds.length > 0) {
        const newProduct = {
          id: generateUniqueId(),
          name,
          vendorId,
          capabilityIds,
        };
        setProducts([...products, newProduct]);
        renderProductEditor();
        uiElements.productNameInput.value = "";
        uiElements.productVendorSelect.value = "";
        Array.from(
          uiElements.productCapabilitiesCheckboxes.querySelectorAll(
            "input:checked"
          )
        ).forEach((cb) => (cb.checked = false));
        handleVendorSelection();
      } else {
        alert(
          "Please enter product name, select vendor, and at least one capability."
        );
      }
    });
  }

  if (uiElements.editProductButton) {
    uiElements.editProductButton.addEventListener("click", () => {
      if (selectedProductId) {
        const name = uiElements.productNameInput.value.trim();
        const vendorId = uiElements.productVendorSelect.value;
        const capabilityIds = Array.from(
          uiElements.productCapabilitiesCheckboxes.querySelectorAll(
            "input:checked"
          )
        ).map((cb) => cb.value);

        if (name && vendorId && capabilityIds.length > 0) {
          setProducts(
            products.map((p) =>
              p.id === selectedProductId
                ? { ...p, name, vendorId, capabilityIds }
                : p
            )
          );
          renderProductEditor();
          uiElements.productNameInput.value = "";
          uiElements.productVendorSelect.value = "";
          Array.from(
            uiElements.productCapabilitiesCheckboxes.querySelectorAll(
              "input:checked"
            )
          ).forEach((cb) => (cb.checked = false));
          setSelectedProductId(null);
          handleVendorSelection();
        } else {
          alert(
            "Please enter product name, select vendor, and at least one capability."
          );
        }
      } else {
        alert("Please select a product to edit.");
      }
    });
  }

  if (uiElements.deleteProductButton) {
    uiElements.deleteProductButton.addEventListener("click", () => {
      if (selectedProductId) {
        if (confirm("Are you sure you want to delete this product?")) {
          setProducts(products.filter((p) => p.id !== selectedProductId));
          renderProductEditor();
          uiElements.productNameInput.value = "";
          uiElements.productVendorSelect.value = "";
          Array.from(
            uiElements.productCapabilitiesCheckboxes.querySelectorAll(
              "input:checked"
            )
          ).forEach((cb) => (cb.checked = false));
          setSelectedProductId(null);
          handleVendorSelection();
        }
      } else {
        alert("Please select a product to delete.");
      }
    });
  }

  if (uiElements.productList) {
    uiElements.productList.addEventListener("click", (e) => {
      const target = e.target.closest("div[data-product-id]");
      if (target) {
        const id = target.dataset.productId;
        setSelectedProductId(id);
        const product = products.find((p) => p.id === id);
        if (product) {
          uiElements.productNameInput.value = product.name;
          uiElements.productVendorSelect.value = product.vendorId;
          Array.from(
            uiElements.productCapabilitiesCheckboxes.querySelectorAll("input")
          ).forEach((cb) => (cb.checked = false));
          if (product.capabilityIds) {
            product.capabilityIds.forEach((capId) => {
              const checkbox =
                uiElements.productCapabilitiesCheckboxes.querySelector(
                  `input[value="${capId}"]`
                );
              if (checkbox) checkbox.checked = true;
            });
          }
        }
        Array.from(uiElements.productList.children).forEach((child) => {
          child.classList.remove("bg-purple-600");
        });
        target.classList.add("bg-purple-600");
      }
    });
  }

  // --- Capability Management ---
  if (uiElements.addCapabilityButton) {
    uiElements.addCapabilityButton.addEventListener("click", () => {
      const name = uiElements.capabilityNameInput.value.trim();
      const sectionSelectValue = uiElements.capabilitySectionSelect.value;

      let newCategory = "Uncategorized";
      let newSection = "Uncategorized";
      let newBorderClass = "border-gray-500";

      // Reverted logic to only handle Data Layer and AI Layer for now
      if (sectionSelectValue === "infrastructure") {
        newCategory = "Data Layer";
        newSection = "Data Layer";
        newBorderClass = "border-purple-600";
      } else if (sectionSelectValue === "aiPlatform") {
        newCategory = "AI Layer";
        newSection = "AI Layer - Custom"; // Default for new AI caps added via editor
        newBorderClass = "border-purple-700";
      }

      if (name && sectionSelectValue) {
        const newCapability = {
          id: generateUniqueId(),
          name,
          category: newCategory,
          section: newSection,
          order: capabilities.length + 1,
          borderColorClass: newBorderClass,
          currentProductId: null,
          isLabel: false,
        };
        setCapabilities([...capabilities, newCapability]);
        renderCapabilityEditor();
        uiElements.capabilityNameInput.value = "";
        uiElements.capabilitySectionSelect.value = "infrastructure"; // Reset to Data Layer default
        handleVendorSelection();
      } else {
        alert("Please enter capability name and select a section.");
      }
    });
  }

  if (uiElements.editCapabilityButton) {
    uiElements.editCapabilityButton.addEventListener("click", () => {
      if (selectedCapabilityId) {
        const name = uiElements.capabilityNameInput.value.trim();
        const sectionSelectValue = uiElements.capabilitySectionSelect.value;

        let updatedCategory = "Uncategorized";
        let updatedSection = "Uncategorized";

        // Reverted logic to only handle Data Layer and AI Layer for now
        if (sectionSelectValue === "infrastructure") {
          updatedCategory = "Data Layer";
          updatedSection = "Data Layer";
        } else if (sectionSelectValue === "aiPlatform") {
          updatedCategory = "AI Layer";
          const existingCap = capabilities.find(
            (c) => c.id === selectedCapabilityId
          );
          updatedSection =
            existingCap && existingCap.section.startsWith("AI Layer")
              ? existingCap.section
              : "AI Layer - Custom";
        }

        if (name && sectionSelectValue) {
          setCapabilities(
            capabilities.map((c) =>
              c.id === selectedCapabilityId
                ? {
                    ...c,
                    name,
                    category: updatedCategory,
                    section: updatedSection,
                  }
                : c
            )
          );
          renderCapabilityEditor();
          uiElements.capabilityNameInput.value = "";
          uiElements.capabilitySectionSelect.value = "infrastructure"; // Reset to Data Layer default
          setSelectedCapabilityId(null);
          handleVendorSelection();
        } else {
          alert("Please enter capability name and select a section.");
        }
      } else {
        alert("Please select a capability to edit.");
      }
    });
  }

  if (uiElements.deleteCapabilityButton) {
    uiElements.deleteCapabilityButton.addEventListener("click", () => {
      if (selectedCapabilityId) {
        if (
          confirm(
            "Are you sure you want to delete this capability? This will also remove it from any products."
          )
        ) {
          setCapabilities(
            capabilities.filter((c) => c.id !== selectedCapabilityId)
          );
          setProducts(
            products.map((p) => ({
              ...p,
              capabilityIds: p.capabilityIds
                ? p.capabilityIds.filter(
                    (capId) => capId !== selectedCapabilityId
                  )
                : [],
            }))
          );

          renderCapabilityEditor();
          renderProductEditor();
          uiElements.capabilityNameInput.value = "";
          uiElements.capabilitySectionSelect.value = "infrastructure"; // Reset to Data Layer default
          setSelectedCapabilityId(null);
          handleVendorSelection();
        }
      } else {
        alert("Please select a capability to delete.");
      }
    });
  }

  if (uiElements.capabilityList) {
    uiElements.capabilityList.addEventListener("click", (e) => {
      const target = e.target.closest("div[data-capability-id]");
      if (target) {
        const id = target.dataset.capabilityId;
        setSelectedCapabilityId(id);
        const capability = capabilities.find((c) => c.id === id);
        if (capability) {
          uiElements.capabilityNameInput.value = capability.name;
          // Map category back to section select value for display
          if (capability.category === "Data Layer") {
            uiElements.capabilitySectionSelect.value = "infrastructure";
          } else if (capability.category === "AI Layer") {
            uiElements.capabilitySectionSelect.value = "aiPlatform";
          }
        }
        Array.from(uiElements.capabilityList.children).forEach((child) => {
          child.classList.remove("bg-purple-600");
        });
        target.classList.add("bg-purple-600");
      }
    });
  }
}
