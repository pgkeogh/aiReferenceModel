import { vendors, products, capabilities, uiElements, selectedVendorId, selectedProductId, selectedCapabilityId, setSelectedVendorId, setSelectedProductId, setSelectedCapabilityId } from './dataStore.js';
import { handleVendorSelection } from './main.js'; // Import for re-rendering after data changes
import { openProductSelectionModal } from './modals.js'; // Import for capability box click

/**
 * Renders the vendor selection dropdown.
 */
export function renderVendorSelector() {
    uiElements.vendorSelectElement.innerHTML = '<option value="">No Vendor Selected</option>';
    vendors.forEach(vendor => {
        const option = document.createElement('option');
        option.value = vendor.id;
        option.textContent = vendor.name;
        uiElements.vendorSelectElement.appendChild(option);
    });
    // Reset selection to default
    uiElements.vendorSelectElement.value = '';
}

/**
 * Updates the display of product names within capability boxes.
 */
export function renderCapabilityBoxes() {
    capabilities.forEach(capability => {
        const capabilityBox = document.querySelector(`[data-capability-id="${capability.id}"]`);
        if (capabilityBox) {
            const productNameDisplay = capabilityBox.querySelector('[data-product-display]');
            if (productNameDisplay) {
                const product = products.find(p => p.id === capability.currentProductId);
                productNameDisplay.textContent = product ? product.name : 'N/A';
            }
        }
    });
}

/**
 * Attaches event listeners to all capability boxes for modal interaction.
 * This should be called once after initial rendering and whenever capabilities might change.
 */
export function attachCapabilityBoxListeners() {
    document.querySelectorAll('[data-capability-id]').forEach(box => {
        // Remove existing listener to prevent duplicates
        box.removeEventListener('click', handleCapabilityBoxClick);
        // Add new listener
        box.addEventListener('click', handleCapabilityBoxClick);
    });
}

function handleCapabilityBoxClick(e) {
    const box = e.currentTarget;
    // Prevent header boxes from opening modal
    if (box.classList.contains('bg-purple-700') || box.classList.contains('bg-blue-700') || box.classList.contains('bg-purple-800')) {
        return;
    }
    const capabilityId = box.dataset.capabilityId;
    openProductSelectionModal(capabilityId);
}


/**
 * Renders the vendor list in the data editor.
 */
export function renderVendorEditor() {
    uiElements.vendorNameInput.value = '';
    setSelectedVendorId(null);
    uiElements.vendorList.innerHTML = '';
    vendors.forEach(vendor => {
        const vendorItem = document.createElement('div');
        vendorItem.className = 'flex justify-between items-center p-2 border-b border-purple-700 hover:bg-purple-700 cursor-pointer transition-colors duration-150';
        vendorItem.textContent = vendor.name;
        vendorItem.dataset.id = vendor.id;
        vendorItem.addEventListener('click', () => {
            setSelectedVendorId(vendor.id);
            uiElements.vendorNameInput.value = vendor.name;
            Array.from(uiElements.vendorList.children).forEach(item => item.classList.remove('bg-purple-600', 'border-purple-400'));
            vendorItem.classList.add('bg-purple-600', 'border-purple-400');
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-500 transition-colors duration-200';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Call deleteVendor from dataEditor.js
            import('./dataEditor.js').then(module => module.deleteVendor(vendor.id));
        });
        vendorItem.appendChild(deleteBtn);
        uiElements.vendorList.appendChild(vendorItem);
    });
}

/**
 * Renders the product list and related controls in the data editor.
 */
export function renderProductEditor() {
    uiElements.productNameInput.value = '';
    uiElements.productVendorSelect.innerHTML = '<option value="">Select Vendor</option>';
    vendors.forEach(vendor => {
        const option = document.createElement('option');
        option.value = vendor.id;
        option.textContent = vendor.name;
        uiElements.productVendorSelect.appendChild(option);
    });
    uiElements.productVendorSelect.value = '';

    uiElements.productCapabilitiesCheckboxes.innerHTML = '';
    capabilities.forEach(capability => {
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-1';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `product-cap-${capability.id}`;
        checkbox.value = capability.id;
        checkbox.className = 'form-checkbox h-4 w-4 text-blue-400 rounded';
        const label = document.createElement('label');
        label.htmlFor = `product-cap-${capability.id}`;
        label.textContent = capability.name;
        label.className = 'ml-1 text-purple-200';
        div.appendChild(checkbox);
        div.appendChild(label);
        uiElements.productCapabilitiesCheckboxes.appendChild(div);
    });

    setSelectedProductId(null);
    uiElements.productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'flex justify-between items-center p-2 border-b border-purple-700 hover:bg-purple-700 cursor-pointer transition-colors duration-150';
        const vendor = vendors.find(v => v.id === product.vendorId);
        productItem.innerHTML = `<span>${product.name} (${vendor ? vendor.name : 'N/A'})</span>`;
        productItem.dataset.id = product.id;
        productItem.addEventListener('click', () => {
            setSelectedProductId(product.id);
            uiElements.productNameInput.value = product.name;
            uiElements.productVendorSelect.value = product.vendorId || '';
            Array.from(uiElements.productCapabilitiesCheckboxes.querySelectorAll('input[type="checkbox"]')).forEach(cb => {
                cb.checked = product.capabilityIds.includes(cb.value);
            });
            Array.from(uiElements.productList.children).forEach(item => item.classList.remove('bg-purple-600', 'border-purple-400'));
            productItem.classList.add('bg-purple-600', 'border-purple-400');
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-500 transition-colors duration-200';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Call deleteProduct from dataEditor.js
            import('./dataEditor.js').then(module => module.deleteProduct(product.id));
        });
        productItem.appendChild(deleteBtn);
        uiElements.productList.appendChild(productItem);
    });
}

/**
 * Renders the capability list in the data editor.
 */
export function renderCapabilityEditor() {
    uiElements.capabilityNameInput.value = '';
    uiElements.capabilitySectionSelect.value = 'infrastructure'; // Default
    setSelectedCapabilityId(null);
    uiElements.capabilityList.innerHTML = '';
    capabilities.forEach(capability => {
        const capabilityItem = document.createElement('div');
        capabilityItem.className = 'flex justify-between items-center p-2 border-b border-purple-700 hover:bg-purple-700 cursor-pointer transition-colors duration-150';
        capabilityItem.textContent = `${capability.name} (${capability.section})`;
        capabilityItem.dataset.id = capability.id;
        capabilityItem.addEventListener('click', () => {
            setSelectedCapabilityId(capability.id);
            uiElements.capabilityNameInput.value = capability.name;
            uiElements.capabilitySectionSelect.value = capability.section;
            Array.from(uiElements.capabilityList.children).forEach(item => item.classList.remove('bg-purple-600', 'border-purple-400'));
            capabilityItem.classList.add('bg-purple-600', 'border-purple-400');
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-500 transition-colors duration-200';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Call deleteCapability from dataEditor.js
            import('./dataEditor.js').then(module => module.deleteCapability(capability.id));
        });
        capabilityItem.appendChild(deleteBtn);
        uiElements.capabilityList.appendChild(capabilityItem);
    });
}