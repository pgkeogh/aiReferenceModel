import { vendors, products, capabilities, uiElements } from './dataStore.js';
import { loadDataFromCSV } from './csvHandler.js';
import { renderVendorSelector, renderCapabilityBoxes, attachCapabilityBoxListeners } from './uiRenderer.js';
import { openProductSelectionModal, closeProductSelectionModal, clearSelectedProductForCapability, openDataEditorModal, closeDataEditorModal } from './modals.js';
import { addVendor, editVendor, deleteVendor, addProduct, editProduct, deleteProduct, addCapability, editCapability, deleteCapability } from './dataEditor.js';
import { sendMessage } from './chatbot.js';

/**
 * Handles vendor selection, assigning products to capabilities based on the selected vendor
 * or falling back to "Cloud Native" if no vendor-specific product is found.
 */
export function handleVendorSelection() {
    const selectedVendorId = uiElements.vendorSelectElement.value;

    // Clear all current product selections first
    capabilities.forEach(c => c.currentProductId = null);

    // Identify the Cloud Native vendor and product
    const cloudNativeVendor = vendors.find(v => v.name === 'Cloud Native');
    const cloudNativeProductId = cloudNativeVendor ? products.find(p => p.vendorId === cloudNativeVendor.id && p.name === 'Cloud Native Base Services')?.id : null;

    capabilities.forEach(capability => {
        let assignedProductId = null;

        // 1. Try to find a product from the selected vendor
        if (selectedVendorId) {
            const vendorProducts = products.filter(p => p.vendorId === selectedVendorId);
            const matchingProduct = vendorProducts.find(p => p.capabilityIds.includes(capability.id));
            if (matchingProduct) {
                assignedProductId = matchingProduct.id;
            }
        }

        // 2. If no product from the selected vendor, try the "Cloud Native" product
        if (!assignedProductId && cloudNativeProductId) {
            const cnProduct = products.find(p => p.id === cloudNativeProductId);
            if (cnProduct && cnProduct.capabilityIds.includes(capability.id)) {
                assignedProductId = cloudNativeProductId;
            }
        }

        // 3. Assign the found product, or keep null if none found
        capability.currentProductId = assignedProductId;
    });
    renderCapabilityBoxes();
}


// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', async () => {
    await loadDataFromCSV();
    renderVendorSelector();
    handleVendorSelection(); // Initial render with fallback logic
    attachCapabilityBoxListeners(); // Attach event listeners to all capability boxes

    // Add event listeners for chatbot
    uiElements.sendChatButton.addEventListener('click', sendMessage);
    uiElements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

uiElements.vendorSelectElement.addEventListener('change', handleVendorSelection);

uiElements.manageDataButton.addEventListener('click', openDataEditorModal);

uiElements.saveCloseDataEditorButton.addEventListener('click', () => closeDataEditorModal(true)); // Pass true to save data

// Product Selection Modal Listeners
uiElements.closeProductModalButton.addEventListener('click', closeProductSelectionModal);
uiElements.closeProductModalButtonAlt.addEventListener('click', closeProductSelectionModal);
uiElements.clearProductSelectionButton.addEventListener('click', clearSelectedProductForCapability);
window.addEventListener('click', (event) => {
    if (event.target === uiElements.productSelectionModal) {
        closeProductSelectionModal();
    }
});

// Data Editor Button Listeners
uiElements.addVendorButton.addEventListener('click', addVendor);
uiElements.editVendorButton.addEventListener('click', editVendor);
uiElements.deleteVendorButton.addEventListener('click', () => deleteVendor(uiElements.selectedVendorId));

uiElements.addProductButton.addEventListener('click', addProduct);
uiElements.editProductButton.addEventListener('click', editProduct);
uiElements.deleteProductButton.addEventListener('click', () => deleteProduct(uiElements.selectedProductId));

uiElements.addCapabilityButton.addEventListener('click', addCapability);
uiElements.editCapabilityButton.addEventListener('click', editCapability);
uiElements.deleteCapabilityButton.addEventListener('click', () => deleteCapability(uiElements.selectedCapabilityId));