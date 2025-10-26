import {
  vendors,
  products,
  capabilities,
  setVendors,
  setProducts,
  setCapabilities,
  generateUniqueId,
  uiElements,
  selectedVendorId,
  setSelectedVendorId,
  selectedProductId,
  setSelectedProductId,
  selectedCapabilityId,
  setSelectedCapabilityId,
} from "./dataStore.js";
import {
  renderVendorEditor,
  renderProductEditor,
  renderCapabilityEditor,
  renderVendorSelector,
  renderAllCapabilityBoxes,
  updateCapabilityBoxProductDisplay,
} from "./uiRenderer.js"; // UPDATED IMPORTS HERE
import { closeDataEditorModal } from "./modals.js";
import { handleVendorSelection } from "./main.js";

// --- Vendor Management ---

uiElements.addVendorButton.addEventListener("click", () => {
  const name = uiElements.vendorNameInput.value.trim();
  if (name) {
    setVendors([...vendors, { id: generateUniqueId(), name }]);
    renderVendorEditor();
    renderVendorSelector(); // Update main vendor dropdown
    handleVendorSelection(); // Re-apply product assignments
  }
});

uiElements.editVendorButton.addEventListener("click", () => {
  if (selectedVendorId) {
    const name = uiElements.vendorNameInput.value.trim();
    if (name) {
      setVendors(
        vendors.map((v) => (v.id === selectedVendorId ? { ...v, name } : v))
      );
      renderVendorEditor();
      renderVendorSelector(); // Update main vendor dropdown
      handleVendorSelection(); // Re-apply product assignments
    }
  }
});

export function deleteVendor(id) {
  if (
    confirm(
      "Are you sure you want to delete this vendor? This will also delete all associated products and unassign capabilities."
    )
  ) {
    // Delete associated products first
    setProducts(products.filter((p) => p.vendorId !== id));

    // Unassign capabilities that were using products from this vendor
    capabilities.forEach((c) => {
      if (
        products.some((p) => p.id === c.currentProductId && p.vendorId === id)
      ) {
        c.currentProductId = null;
      }
    });

    // Delete the vendor
    setVendors(vendors.filter((v) => v.id !== id));

    renderVendorEditor();
    renderProductEditor(); // Products might have changed
    renderVendorSelector(); // Update main vendor dropdown
    renderAllCapabilityBoxes(); // Re-render all capability boxes if anything was unassigned
    handleVendorSelection(); // Re-apply product assignments
  }
}

// --- Product Management ---

uiElements.addProductButton.addEventListener("click", () => {
  const name = uiElements.productNameInput.value.trim();
  const vendorId = uiElements.productVendorSelect.value;
  const capabilityIds = Array.from(
    uiElements.productCapabilitiesCheckboxes.querySelectorAll("input:checked")
  ).map((cb) => cb.value);

  if (name && vendorId) {
    setProducts([
      ...products,
      { id: generateUniqueId(), name, vendorId, capabilityIds },
    ]);
    renderProductEditor();
    renderAllCapabilityBoxes(); // Re-render all capability boxes to reflect potential new product availability
    handleVendorSelection(); // Re-apply product assignments
  } else {
    alert("Please enter product name and select a vendor.");
  }
});

uiElements.editProductButton.addEventListener("click", () => {
  if (selectedProductId) {
    const name = uiElements.productNameInput.value.trim();
    const vendorId = uiElements.productVendorSelect.value;
    const capabilityIds = Array.from(
      uiElements.productCapabilitiesCheckboxes.querySelectorAll("input:checked")
    ).map((cb) => cb.value);

    if (name && vendorId) {
      setProducts(
        products.map((p) =>
          p.id === selectedProductId
            ? { ...p, name, vendorId, capabilityIds }
            : p
        )
      );
      renderProductEditor();
      renderAllCapabilityBoxes(); // Re-render all capability boxes to reflect potential product changes
      handleVendorSelection(); // Re-apply product assignments
    } else {
      alert("Please enter product name and select a vendor.");
    }
  }
});

export function deleteProduct(id) {
  if (
    confirm(
      "Are you sure you want to delete this product? It will be unassigned from any capabilities."
    )
  ) {
    // Unassign capability if this product was selected
    capabilities.forEach((c) => {
      if (c.currentProductId === id) {
        c.currentProductId = null;
      }
    });
    setProducts(products.filter((p) => p.id !== id));
    renderProductEditor();
    renderAllCapabilityBoxes(); // Re-render all capability boxes to reflect product removal
    handleVendorSelection(); // Re-apply product assignments
  }
}

// --- Capability Management ---

uiElements.addCapabilityButton.addEventListener("click", () => {
  const name = uiElements.capabilityNameInput.value.trim();
  const section = uiElements.capabilitySectionSelect.value;
  if (name && section) {
    setCapabilities([
      ...capabilities,
      { id: generateUniqueId(), name, section, currentProductId: null },
    ]);
    renderCapabilityEditor();
    renderProductEditor(); // Capabilities list for products might have changed
    renderAllCapabilityBoxes(); // NEW: Render all capability boxes to show the new one
    handleVendorSelection(); // Re-apply product assignments
  } else {
    alert("Please enter capability name and select a section.");
  }
});

uiElements.editCapabilityButton.addEventListener("click", () => {
  if (selectedCapabilityId) {
    const name = uiElements.capabilityNameInput.value.trim();
    const section = uiElements.capabilitySectionSelect.value;
    if (name && section) {
      setCapabilities(
        capabilities.map((c) =>
          c.id === selectedCapabilityId ? { ...c, name, section } : c
        )
      );
      renderCapabilityEditor();
      renderProductEditor(); // Capabilities list for products might have changed
      renderAllCapabilityBoxes(); // NEW: Re-render all capability boxes to update existing one
      handleVendorSelection(); // Re-apply product assignments
    } else {
      alert("Please enter capability name and select a section.");
    }
  }
});

export function deleteCapability(id) {
  if (
    confirm(
      "Are you sure you want to delete this capability? It will be removed from all products and the main display."
    )
  ) {
    // Remove from products' capability lists
    setProducts(
      products.map((p) => ({
        ...p,
        capabilityIds: p.capabilityIds.filter((capId) => capId !== id),
      }))
    );
    setCapabilities(capabilities.filter((c) => c.id !== id));
    renderCapabilityEditor();
    renderProductEditor(); // Products might have changed (checkboxes)
    renderAllCapabilityBoxes(); // NEW: Completely re-render capability boxes
    handleVendorSelection(); // Re-apply product assignments
  }
}

// --- Save & Close Data Editor ---

uiElements.saveCloseDataEditorButton.addEventListener("click", () =>
  closeDataEditorModal(true)
);
