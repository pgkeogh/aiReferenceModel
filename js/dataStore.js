// js/dataStore.js
// Version: 2023-10-27_10 - Refined capability merge logic, corrected Data Layer capabilities

// Global data stores - these will be populated by loadData from csvHandler.js
export let vendors = [];
export let products = [];

// Capabilities are now defined with their structural properties to match the graphic
// 'category': for Data Layer vs AI Layer
// 'section': for grouping within a layer (e.g., 'AI Layer - Top', 'AI Layer - UI')
// 'order': for ordering within a section
// 'borderColorClass': for visual styling (Tailwind CSS classes)
// 'isLabel': true for non-interactive text labels like "Standards and protocols"
export let capabilities = [
  // --- Data Layer Capabilities ---
  {
    id: "cap_data_lake",
    name: "Data Lake & MDM",
    category: "Data Layer",
    section: "Data Layer",
    order: 1,
    borderColorClass: "border-purple-600",
    currentProductId: null,
  },
  {
    id: "cap_data_virtualisation",
    name: "Data Virtualisation",
    category: "Data Layer",
    section: "Data Layer",
    order: 2,
    borderColorClass: "border-purple-600",
    currentProductId: null,
  },
  {
    id: "cap_data_governance",
    name: "Data Governance",
    category: "Data Layer",
    section: "Data Layer",
    order: 3,
    borderColorClass: "border-purple-600",
    currentProductId: null,
  },
  {
    id: "cap_data_security",
    name: "Data Security",
    category: "Data Layer",
    section: "Data Layer",
    order: 4,
    borderColorClass: "border-purple-600",
    currentProductId: null,
  },
  // These capabilities were previously "Uncategorized" in your console log, now explicitly in Data Layer
  {
    id: "cap_storage",
    name: "Unstructured Data",
    category: "Data Layer",
    section: "Data Layer",
    order: 5,
    borderColorClass: "border-purple-600",
    currentProductId: null,
  },
  {
    id: "cap_crm",
    name: "CRM Systems",
    category: "Data Layer",
    section: "Data Layer",
    order: 6,
    borderColorClass: "border-purple-600",
    currentProductId: null,
  },
  {
    id: "cap_erp",
    name: "ERP Systems",
    category: "Data Layer",
    section: "Data Layer",
    order: 7,
    borderColorClass: "border-purple-600",
    currentProductId: null,
  },
  {
    id: "cap_messaging_queues",
    name: "Messaging & Queues",
    category: "Data Layer",
    section: "Data Layer",
    order: 8,
    borderColorClass: "border-purple-600",
    currentProductId: null,
  },
  {
    id: "cap_api_gateways",
    name: "API Gateways",
    category: "Data Layer",
    section: "Data Layer",
    order: 9,
    borderColorClass: "border-purple-600",
    currentProductId: null,
  },

  // --- AI Layer Capabilities ---

  // AI Layer - Top Row (Light Blue Border)
  {
    id: "cap_ai_onboarding",
    name: "AI Onboarding",
    category: "AI Layer",
    section: "AI Layer - Top",
    order: 1,
    borderColorClass: "border-blue-400",
    currentProductId: null,
  },
  {
    id: "cap_ai_testing",
    name: "AI Testing",
    category: "AI Layer",
    section: "AI Layer - Top",
    order: 2,
    borderColorClass: "border-blue-400",
    currentProductId: null,
  },
  {
    id: "cap_ai_integrations",
    name: "AI Integrations",
    category: "AI Layer",
    section: "AI Layer - Top",
    order: 3,
    borderColorClass: "border-blue-400",
    currentProductId: null,
  },

  // AI Layer - UI (Renamed from Core, DXC Orange border)
  {
    id: "cap_web_uis",
    name: "WebUIs",
    category: "AI Layer",
    section: "AI Layer - UI",
    order: 1,
    borderColorClass: "border-orange-500",
    currentProductId: null,
  },
  {
    id: "cap_developer_ecosystem",
    name: "Developer Ecosystem",
    category: "AI Layer",
    section: "AI Layer - UI",
    order: 2,
    borderColorClass: "border-orange-500",
    currentProductId: null,
  },

  // AI Layer - Governance (DXC Gold border)
  {
    id: "cap_ai_compliance",
    name: "AI Compliance",
    category: "AI Layer",
    section: "AI Layer - Governance",
    order: 1,
    borderColorClass: "border-amber-500",
    currentProductId: null,
  },
  {
    id: "cap_ai_governance",
    name: "AI Governance",
    category: "AI Layer",
    section: "AI Layer - Governance",
    order: 2,
    borderColorClass: "border-amber-500",
    currentProductId: null,
  },

  // AI Layer - Operations (DXC Yellow border)
  {
    id: "cap_ai_monitoring",
    name: "AI Monitoring",
    category: "AI Layer",
    section: "AI Layer - Operations",
    order: 1,
    borderColorClass: "border-yellow-400",
    currentProductId: null,
  },
  {
    id: "cap_ai_gateway",
    name: "AI Gateway",
    category: "AI Layer",
    section: "AI Layer - Operations",
    order: 2,
    borderColorClass: "border-yellow-400",
    currentProductId: null,
  },
  {
    id: "cap_ai_security",
    name: "AI Security",
    category: "AI Layer",
    section: "AI Layer - Operations",
    order: 3,
    borderColorClass: "border-yellow-400",
    currentProductId: null,
  },

  // AI Layer - Standards Label (DXC Blue border)
  {
    id: "cap_standards_protocols_label",
    name: "Standards and protocols: A2A, MCP, others",
    category: "AI Layer",
    section: "AI Layer - Standards",
    isLabel: true,
    borderColorClass: "border-blue-500",
    currentProductId: null,
  },

  // AI Layer - Models (Renamed from Advanced, DXC Bright Teal border)
  {
    id: "cap_model_management_customization",
    name: "Model Management + Customization",
    category: "AI Layer",
    section: "AI Layer - Models",
    order: 1,
    borderColorClass: "border-teal-400",
    currentProductId: null,
  },
  {
    id: "cap_foundation_models",
    name: "LLM Solutions",
    category: "AI Layer",
    section: "AI Layer - Models",
    order: 2,
    borderColorClass: "border-teal-400",
    currentProductId: null,
  },

  // AI Layer - Deployment (DXC Dark Teal border)
  {
    id: "cap_ai_deployment",
    name: "AI Deployment",
    category: "AI Layer",
    section: "AI Layer - Deployment",
    order: 1,
    borderColorClass: "border-teal-700",
    currentProductId: null,
  },
  {
    id: "cap_ai_hosting_scalability",
    name: "AI Hosting + Scalability",
    category: "AI Layer",
    section: "AI Layer - Deployment",
    order: 2,
    borderColorClass: "border-teal-700",
    currentProductId: null,
  },
];

export let currentModalCapabilityId = null;
export let selectedVendorId = null;
export let selectedProductId = null;
export let selectedCapabilityId = null;

export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function setVendors(newVendors) {
  vendors = newVendors;
}

export function setProducts(newProducts) {
  products = newProducts;
}

export function setCapabilities(newCapabilitiesFromCsv) {
  const canonicalCapabilitiesMap = new Map(
    capabilities.map((cap) => [cap.id, cap])
  ); // Map of hardcoded capabilities

  const mergedCapabilities = capabilities.map((canonicalCap) => {
    // Iterate over hardcoded caps
    const newCapFromCsv = newCapabilitiesFromCsv.find(
      (csvCap) => csvCap.id === canonicalCap.id
    );
    if (newCapFromCsv) {
      // If a hardcoded capability exists in CSV, update only its 'name' and 'currentProductId' (if any)
      // Preserve all structural properties from hardcoded definition
      return {
        ...canonicalCap, // Start with the canonical structure
        name: newCapFromCsv.name || canonicalCap.name, // Allow CSV to update name
        currentProductId:
          newCapFromCsv.currentProductId || canonicalCap.currentProductId, // Allow CSV to update currentProductId (though usually set by JS)
      };
    } else {
      // If hardcoded capability is NOT in CSV, keep it as is
      return canonicalCap;
    }
  });

  // Add any new capabilities found ONLY in CSV (not hardcoded) with default structural properties
  const csvOnlyCapabilities = newCapabilitiesFromCsv
    .filter((csvCap) => !canonicalCapabilitiesMap.has(csvCap.id))
    .map((csvCap) => ({
      id: csvCap.id || generateUniqueId(),
      name: csvCap.name || "Unnamed Capability",
      category: csvCap.category || "Uncategorized", // These will likely be "Uncategorized" unless explicitly set in CSV
      section: csvCap.section || "Uncategorized",
      order: csvCap.order || capabilities.length + 1,
      borderColorClass: csvCap.borderColorClass || "border-gray-500",
      currentProductId: csvCap.currentProductId || null,
      isLabel: csvCap.isLabel || false,
    }));

  capabilities = [...mergedCapabilities, ...csvOnlyCapabilities];
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
