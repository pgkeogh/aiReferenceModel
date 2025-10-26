// Global data stores
export let vendors = [];
export let products = [];
export let capabilities = [];

// UI elements (exported for use in main.js and other modules)
export const uiElements = {
    vendorSelectElement: document.getElementById('vendor-select'),
    manageDataButton: document.getElementById('manage-data-button'),
    dataEditorContainer: document.getElementById('data-editor-container'),
    mainAppContainer: document.getElementById('main-app'),
    productSelectionModal: document.getElementById('product-selection-modal'),
    closeProductModalButton: document.getElementById('close-product-modal'),
    closeProductModalButtonAlt: document.getElementById('close-product-modal-button'),
    modalCapabilityName: document.getElementById('modal-capability-name'),
    modalProductList: document.getElementById('modal-product-list'),
    clearProductSelectionButton: document.getElementById('clear-product-selection'),
    saveCloseDataEditorButton: document.getElementById('save-close-data-editor'),
    vendorNameInput: document.getElementById('vendor-name-input'),
    addVendorButton: document.getElementById('add-vendor-button'),
    editVendorButton: document.getElementById('edit-vendor-button'),
    deleteVendorButton: document.getElementById('delete-vendor-button'),
    vendorList: document.getElementById('vendor-list'),
    productNameInput: document.getElementById('product-name-input'),
    productVendorSelect: document.getElementById('product-vendor-select'),
    productCapabilitiesCheckboxes: document.getElementById('product-capabilities-checkboxes'),
    addProductButton: document.getElementById('add-product-button'),
    editProductButton: document.getElementById('edit-product-button'),
    deleteProductButton: document.getElementById('delete-product-button'),
    productList: document.getElementById('product-list'),
    capabilityNameInput: document.getElementById('capability-name-input'),
    capabilitySectionSelect: document.getElementById('capability-section-select'),
    addCapabilityButton: document.getElementById('add-capability-button'),
    editCapabilityButton: document.getElementById('edit-capability-button'),
    deleteCapabilityButton: document.getElementById('delete-capability-button'),
    capabilityList: document.getElementById('capability-list'),
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    sendChatButton: document.getElementById('send-chat-button'),
};

export let currentModalCapabilityId = null; // To keep track of which capability box was clicked
export let selectedVendorId = null;
export let selectedProductId = null;
export let selectedCapabilityId = null;

/**
 * Generates a unique ID for new entries.
 * @returns {string} A unique ID.
 */
export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Functions to update the global data arrays
export function setVendors(newVendors) {
    vendors = newVendors;
}

export function setProducts(newProducts) {
    products = newProducts;
}

export function setCapabilities(newCapabilities) {
    capabilities = newCapabilities;
}

export function setCurrentModalCapabilityId(id) {
    currentModalCapabilityId = id;
}

export function setSelectedVendorId(id) {
    selectedVendorId = id;
}

export function setSelectedProductId(id) {
    selectedProductId = id;
}

export function setSelectedCapabilityId(id) {
    selectedCapabilityId = id;
}