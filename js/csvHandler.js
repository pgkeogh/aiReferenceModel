// js/csvHandler.js
// Version: 2023-10-27_13 - Fixed vendor lookup to use vendor ID from products.csv

import {
  vendors,
  products,
  capabilities,
  setVendors,
  setProducts,
  setCapabilities,
  generateUniqueId,
} from "./dataStore.js";

const VENDORS_CSV_PATH = "data/vendors.csv";
const PRODUCTS_CSV_PATH = "data/products.csv";
const CAPABILITIES_CSV_PATH = "data/capabilities.csv";

const LOCAL_STORAGE_KEY = "aiPlatformData";

async function parseCsv(url) {
  return new Promise((resolve, reject) => {
    if (typeof Papa === "undefined") {
      console.error(
        "PapaParse is not loaded. Please ensure its CDN script is in index.html."
      );
      return reject(new Error("PapaParse not found."));
    }

    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function saveDataToLocalStorage() {
  try {
    const dataToSave = {
      vendors: vendors,
      products: products,
      capabilities: capabilities,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    console.log("CSV_HANDLER: Data saved to Local Storage.");
  } catch (e) {
    console.error("CSV_HANDLER: Error saving data to Local Storage:", e);
  }
}

function loadDataFromLocalStorage() {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setVendors(parsedData.vendors || []);
      setProducts(parsedData.products || []);

      setCapabilities(parsedData.capabilities || []);

      console.log("CSV_HANDLER: Data loaded from Local Storage.");
      console.log("CSV_HANDLER: Vendors from LS:", vendors);
      console.log("CSV_HANDLER: Capabilities from LS (merged):", capabilities);
      console.log("CSV_HANDLER: Products from LS:", products);
      return true;
    }
  } catch (e) {
    console.error("CSV_HANDLER: Error loading data from Local Storage:", e);
  }
  return false;
}

export async function loadData() {
  if (loadDataFromLocalStorage()) {
    return;
  }

  console.log(
    "CSV_HANDLER: Local Storage empty or failed. Loading from CSV files..."
  );
  try {
    const [csvVendors, csvProducts, csvCapabilities] = await Promise.all([
      parseCsv(VENDORS_CSV_PATH),
      parseCsv(PRODUCTS_CSV_PATH),
      parseCsv(CAPABILITIES_CSV_PATH),
    ]);

    // Process Vendors
    const parsedVendors = csvVendors.map((row) => ({
      id: row.id || generateUniqueId(),
      name: row.name || row.Vendor,
    }));
    setVendors(parsedVendors);
    console.log("CSV_HANDLER: Parsed Vendors from CSV:", vendors);

    // Process Capabilities
    const parsedCapabilitiesFromCsv = csvCapabilities.map((row) => ({
      id:
        row.id ||
        `cap_${(row.name || row.Capability).toLowerCase().replace(/\s/g, "_")}`,
      name: row.name || row.Capability,
    }));
    setCapabilities(parsedCapabilitiesFromCsv);
    console.log(
      "CSV_HANDLER: Parsed Capabilities from CSV (merged with hardcoded):",
      capabilities
    );

    // Process Products
    const parsedProducts = csvProducts.map((row) => {
      // --- CRITICAL FIX: Match row.Vendor (which is the ID) against v.id ---
      const vendor = parsedVendors.find(
        (v) =>
          v.id.toLowerCase().trim() === (row.Vendor || "").toLowerCase().trim()
      );

      const capabilityIdsFromCsv = row.Capability
        ? row.Capability.split(",").map((name) => name.trim())
        : [];
      const mappedCapabilityIds = capabilityIdsFromCsv
        .map((capIdFromCsv) => {
          const capability = capabilities.find(
            (c) => c.id.toLowerCase() === capIdFromCsv.toLowerCase()
          );
          if (!capability) {
            console.warn(
              `CSV_HANDLER: No matching capability found for ID: "${capIdFromCsv}" in product "${
                row.name || row.Product
              }"`
            );
          }
          return capability ? capability.id : null;
        })
        .filter((id) => id !== null);

      const newProduct = {
        id: row.id || generateUniqueId(),
        name: row.name || row.Product,
        vendorId: vendor ? vendor.id : null, // Now vendor.id will be correctly assigned
        capabilityIds: mappedCapabilityIds,
      };

      console.log(
        `CSV_HANDLER: Processing product: "${newProduct.name}" (Row Vendor: "${
          row.Vendor || "N/A"
        }", Row Capability: "${
          row.Capability || "N/A"
        }") -> Mapped Vendor ID: ${
          newProduct.vendorId
        }, Mapped Capability IDs:`,
        newProduct.capabilityIds
      );
      return newProduct;
    });
    setProducts(parsedProducts);
    console.log("CSV_HANDLER: Parsed Products from CSV:", products);

    console.log("CSV_HANDLER: Data loaded successfully from CSV files.");
    saveDataToLocalStorage();
  } catch (error) {
    console.error("CSV_HANDLER: Error loading or parsing CSV data:", error);
    alert(
      "Failed to load initial data. Please ensure 'data/vendors.csv', 'data/products.csv', and 'data/capabilities.csv' exist and are correctly formatted."
    );
  }
}
