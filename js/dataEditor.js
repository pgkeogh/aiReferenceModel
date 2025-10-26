import { vendors, products, capabilities, generateUniqueId, uiElements, selectedVendorId, selectedProductId, selectedCapabilityId, setVendors, setProducts, setCapabilities } from './dataStore.js';
import { renderVendorEditor, renderProductEditor, renderCapabilityEditor, renderCapabilityBoxes, renderVendorSelector } from './uiRenderer.js';
import { handleVendorSelection } from './main.js'; // For re-applying vendor selection logic

/** Adds a new vendor. */
export function addVendor() {
    const name = uiElements.vendorNameInput.value.trim();
    if (!name) { alert('Vendor name cannot be empty.'); return; }
    if (vendors.some(v => v.name.toLowerCase() === name.toLowerCase())) { alert('Vendor with this name already exists.'); return; }
    vendors.push({ id: generateUniqueId(), name });
    renderVendorEditor();
    renderProductEditor();
    renderVendorSelector();
}

/** Edits an existing vendor. */
export function editVendor() {
    if (!selectedVendorId) { alert('Select a vendor to edit.'); return; }
    const name = uiElements.vendorNameInput.value.trim();
    if (!name) { alert('Vendor name cannot be empty.'); return; }
    if (vendors.some(v => v.name.toLowerCase() === name.toLowerCase() && v.id !== selectedVendorId)) { alert('Another vendor with this name already exists.'); return; }

    const vendor = vendors.find(v => v.id === selectedVendorId);
    if (vendor) {
        vendor.name = name;
        renderVendorEditor();
        renderProductEditor();
        renderVendorSelector();
        handleVendorSelection();
    }
}

/**
 * Deletes a vendor and its associated products.
 * @param {string} id - The ID of the vendor to delete.
 */
export function deleteVendor(id) {
    if (!confirm('Are you sure you want to delete this vendor? All associated products will also be deleted.')) return;
    setVendors(vendors.filter(v => v.id !== id));
    setProducts(products.filter(p => p.vendorId !== id));
    capabilities.forEach(c => {
        if (products.find(p => p.id === c.currentProductId)?.vendorId === id) {
            c.currentProductId = null;
        }
    });
    renderVendorEditor();
    renderProductEditor();
    renderCapabilityBoxes();
    renderVendorSelector();
    handleVendorSelection();
}

/** Adds a new product. */
export function addProduct() {
    const name = uiElements.productNameInput.value.trim();
    const vendorId = uiElements.productVendorSelect.value;
    const capabilityIds = Array.from(uiElements.productCapabilitiesCheckboxes.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

    if (!name) { alert('Product name cannot be empty.'); return; }
    if (!vendorId) { alert('Please select a vendor for the product.'); return; }
    if (products.some(p => p.name.toLowerCase() === name.toLowerCase() && p.vendorId === vendorId)) { alert('Product with this name already exists for this vendor.'); return; }

    products.push({ id: generateUniqueId(), name, vendorId, capabilityIds });
    renderProductEditor();
    handleVendorSelection();
}

/** Edits an existing product. */
export function editProduct() {
    if (!selectedProductId) { alert('Select a product to edit.'); return; }
    const name = uiElements.productNameInput.value.trim();
    const vendorId = uiElements.productVendorSelect.value;
    const capabilityIds = Array.from(uiElements.productCapabilitiesCheckboxes.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

    if (!name) { alert('Product name cannot be empty.'); return; }
    if (!vendorId) { alert('Please select a vendor for the product.'); return; }
    if (products.some(p => p.name.toLowerCase() === name.toLowerCase() && p.vendorId === vendorId && p.id !== selectedProductId)) { alert('Another product with this name already exists for this vendor.'); return; }

    const product = products.find(p => p.id === selectedProductId);
    if (product) {
        product.name = name;
        product.vendorId = vendorId;
        product.capabilityIds = capabilityIds;
        renderProductEditor();
        handleVendorSelection();
        renderCapabilityBoxes();
    }
}

/**
 * Deletes a product.
 * @param {string} id - The ID of the product to delete.
 */
export function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setProducts(products.filter(p => p.id !== id));
    capabilities.forEach(c => {
        if (c.currentProductId === id) {
            c.currentProductId = null;
        }
    });
    renderProductEditor();
    renderCapabilityBoxes();
    handleVendorSelection();
}

/** Adds a new capability. */
export function addCapability() {
    const name = uiElements.capabilityNameInput.value.trim();
    const section = uiElements.capabilitySectionSelect.value;
    if (!name) { alert('Capability name cannot be empty.'); return; }
    if (capabilities.some(c => c.name.toLowerCase() === name.toLowerCase())) { alert('Capability with this name already exists.'); return; }

    capabilities.push({ id: generateUniqueId(), name, section, currentProductId: null });
    renderCapabilityEditor();
    renderProductEditor();
}

/** Edits an existing capability. */
export function editCapability() {
    if (!selectedCapabilityId) { alert('Select a capability to edit.'); return; }
    const name = uiElements.capabilityNameInput.value.trim();
    const section = uiElements.capabilitySectionSelect.value;
    if (!name) { alert('Capability name cannot be empty.'); return; }
    if (capabilities.some(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== selectedCapabilityId)) { alert('Another capability with this name already exists.'); return; }

    const capability = capabilities.find(c => c.id === selectedCapabilityId);
    if (capability) {
        capability.name = name;
        capability.section = section;
        renderCapabilityEditor();
        renderProductEditor();
        renderCapabilityBoxes();
    }
}

/**
 * Deletes a capability.
 * @param {string} id - The ID of the capability to delete.
 */
export function deleteCapability(id) {
    if (!confirm('Are you sure you want to delete this capability? All products associated with it will lose this capability.')) return;
    setCapabilities(capabilities.filter(c => c.id !== id));
    products.forEach(p => {
        p.capabilityIds = p.capabilityIds.filter(cid => cid !== id);
    });
    renderCapabilityEditor();
    renderProductEditor();
    renderCapabilityBoxes();
    handleVendorSelection();
}