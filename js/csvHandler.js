import {
  setVendors,
  setProducts,
  setCapabilities,
  vendors,
  products,
  capabilities,
} from "./dataStore.js";

// Hardcoded default data (will be used if no data in localStorage)
const defaultVendors = [
  { id: "v1", name: "AWS" },
  { id: "v2", name: "Azure" },
  { id: "v3", name: "Google Cloud" },
  { id: "v4", name: "Cloud Native" }, // For base services
];

const defaultProducts = [
  {
    id: "p1",
    name: "S3",
    vendorId: "v1",
    capabilityIds: ["dataLake", "storage"],
  },
  { id: "p2", name: "Redshift", vendorId: "v1", capabilityIds: ["dataLake"] },
  {
    id: "p3",
    name: "Azure Data Lake Storage",
    vendorId: "v2",
    capabilityIds: ["dataLake", "storage"],
  },
  {
    id: "p4",
    name: "Synapse Analytics",
    vendorId: "v2",
    capabilityIds: ["dataLake"],
  },
  {
    id: "p5",
    name: "Google Cloud Storage",
    vendorId: "v3",
    capabilityIds: ["dataLake", "storage"],
  },
  { id: "p6", name: "BigQuery", vendorId: "v3", capabilityIds: ["dataLake"] },
  {
    id: "p7",
    name: "Cloud Native Base Services",
    vendorId: "v4",
    capabilityIds: [
      "dataLake",
      "virtualisation",
      "vectorDB",
      "storage",
      "aiOnboarding",
      "aiTesting",
      "aiIntegrations",
      "webUIs",
      "developerEcosystem",
      "aiCompliance",
      "aiGovernance",
      "aiMonitoring",
      "aiGateway",
      "aiSecurity",
      "modelManagementCustomization",
      "agenticEngines",
      "aiDeployment",
      "aiHostingScalability",
    ],
  },
  {
    id: "p8",
    name: "Databricks on AWS",
    vendorId: "v1",
    capabilityIds: [
      "dataLake",
      "virtualisation",
      "aiOnboarding",
      "modelManagementCustomization",
    ],
  },
  {
    id: "p9",
    name: "Snowflake on Azure",
    vendorId: "v2",
    capabilityIds: ["dataLake", "virtualisation"],
  },
  {
    id: "p10",
    name: "OpenAI GPT-4",
    vendorId: "v5",
    capabilityIds: [
      "aiOnboarding",
      "modelManagementCustomization",
      "agenticEngines",
    ],
  }, // Assuming v5 for OpenAI
  {
    id: "p11",
    name: "Hugging Face Transformers",
    vendorId: "v6",
    capabilityIds: ["aiOnboarding", "modelManagementCustomization"],
  }, // Assuming v6 for Hugging Face
  {
    id: "p12",
    name: "Kubernetes (EKS)",
    vendorId: "v1",
    capabilityIds: ["aiDeployment", "aiHostingScalability"],
  },
  {
    id: "p13",
    name: "Azure Kubernetes Service (AKS)",
    vendorId: "v2",
    capabilityIds: ["aiDeployment", "aiHostingScalability"],
  },
  {
    id: "p14",
    name: "Vertex AI",
    vendorId: "v3",
    capabilityIds: [
      "aiOnboarding",
      "aiTesting",
      "aiIntegrations",
      "modelManagementCustomization",
      "aiDeployment",
      "aiHostingScalability",
    ],
  },
  {
    id: "p15",
    name: "Azure Machine Learning",
    vendorId: "v2",
    capabilityIds: [
      "aiOnboarding",
      "aiTesting",
      "aiIntegrations",
      "modelManagementCustomization",
      "aiDeployment",
      "aiHostingScalability",
    ],
  },
  {
    id: "p16",
    name: "AWS SageMaker",
    vendorId: "v1",
    capabilityIds: [
      "aiOnboarding",
      "aiTesting",
      "aiIntegrations",
      "modelManagementCustomization",
      "aiDeployment",
      "aiHostingScalability",
    ],
  },
  {
    id: "p17",
    name: "MongoDB Atlas",
    vendorId: "v7",
    capabilityIds: ["vectorDB", "storage"],
  }, // Assuming v7 for MongoDB
  { id: "p18", name: "Pinecone", vendorId: "v8", capabilityIds: ["vectorDB"] }, // Assuming v8 for Pinecone
];

const defaultCapabilities = [
  // Infrastructure/Data Layer
  {
    id: "dataLake",
    name: "Data Lake",
    section: "infrastructure",
    currentProductId: null,
  },
  {
    id: "virtualisation",
    name: "Virtualisation",
    section: "infrastructure",
    currentProductId: null,
  },
  {
    id: "vectorDB",
    name: "Vector DB",
    section: "infrastructure",
    currentProductId: null,
  },
  {
    id: "storage",
    name: "Storage",
    section: "infrastructure",
    currentProductId: null,
  },

  // AI Platform Capabilities
  {
    id: "aiOnboarding",
    name: "AI Onboarding",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "aiTesting",
    name: "AI Testing",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "aiIntegrations",
    name: "AI Integrations",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "webUIs",
    name: "WebUIs",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "developerEcosystem",
    name: "Developer Ecosystem",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "aiCompliance",
    name: "AI Compliance",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "aiGovernance",
    name: "AI Governance",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "aiMonitoring",
    name: "AI Monitoring",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "aiGateway",
    name: "AI Gateway",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "aiSecurity",
    name: "AI Security",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "modelManagementCustomization",
    name: "Model Management + Customization",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "agenticEngines",
    name: "Agentic Engines",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "aiDeployment",
    name: "AI Deployment",
    section: "aiPlatform",
    currentProductId: null,
  },
  {
    id: "aiHostingScalability",
    name: "AI Hosting + Scalability",
    section: "aiPlatform",
    currentProductId: null,
  },
];

/**
 * Loads application data from localStorage, or falls back to default data if not found.
 */
export async function loadData() {
  try {
    const storedData = localStorage.getItem("appData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setVendors(parsedData.vendors || defaultVendors);
      setProducts(parsedData.products || defaultProducts);
      setCapabilities(parsedData.capabilities || defaultCapabilities);
      console.log("Data loaded from localStorage.");
      return; // Exit if data was loaded from localStorage
    }
  } catch (error) {
    console.error(
      "Error loading or parsing data from localStorage, falling back to defaults:",
      error
    );
    // Fall through to load defaults if localStorage data is corrupted
  }

  // If no data in localStorage or an error occurred, load defaults
  setVendors(defaultVendors);
  setProducts(defaultProducts);
  setCapabilities(defaultCapabilities);
  console.log("Default data loaded.");
}

/**
 * Saves the current application data (vendors, products, capabilities) to localStorage.
 */
export function saveData() {
  try {
    const dataToSave = {
      vendors: vendors,
      products: products,
      capabilities: capabilities,
    };
    localStorage.setItem("appData", JSON.stringify(dataToSave));
    console.log("Data saved to localStorage.");
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
    alert("Failed to save data. Please check your browser's storage settings.");
  }
}
