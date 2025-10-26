import { vendors, products, capabilities, setVendors, setProducts, setCapabilities } from './dataStore.js';

/**
 * Converts an array of objects to a CSV string.
 * @param {Array<Object>} data The array of objects to convert.
 * @param {Array<string>} headers Optional: Specific headers to include and their order.
 * @returns {string} The CSV formatted string.
 */
export function convertToCsv(data, headers) {
    if (!data || data.length === 0) {
        return headers ? headers.join(',') : ''; // Return headers even if no data
    }

    const actualHeaders = headers || Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(actualHeaders.join(','));

    // Add data rows
    for (const row of data) {
        const values = actualHeaders.map(header => {
            const val = row[header];
            // Handle null/undefined, and escape commas/quotes for CSV
            if (val === null || val === undefined) {
                return '';
            }
            // If the value contains a comma or double quote, enclose it in double quotes
            // and escape any existing double quotes by doubling them.
            const stringVal = String(val);
            if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n') || stringVal.includes('\r')) {
                return `"${stringVal.replace(/"/g, '""')}"`;
            }
            return stringVal;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

/**
 * Initiates a download of a CSV file.
 * @param {string} filename The desired filename for the download.
 * @param {string} csvContent The CSV data as a string.
 */
export function downloadCsvFile(filename, csvContent) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up the URL object
        console.log(`Download initiated for ${filename}`);
    } else {
        alert('Your browser does not support downloading files directly. Please copy the data manually.');
    }
}

/**
 * Parses a CSV string into an array of objects.
 * Assumes the first row is headers.
 * @param {string} csvString The CSV data as a string.
 * @returns {Array<Object>} An array of objects.
 */
export function parseCsv(csvString) {
    return PapaParse.parse(csvString, { header: true, skipEmptyLines: true }).data;
}

/**
 * Saves current vendors, products, and capabilities data to CSV files by triggering downloads.
 */
export async function saveDataToCSV() {
    try {
        // Prepare products for CSV: convert capabilityIds array to comma-separated string
        const productsForCsv = products.map(p => ({
            ...p,
            capabilityIds: p.capabilityIds ? p.capabilityIds.join(',') : ''
        }));

        // Define headers explicitly for consistency, or let convertToCsv infer
        // Assuming your data objects always have these keys
        const vendorHeaders = ['id', 'name'];
        const productHeaders = ['id', 'name', 'vendorId', 'capabilityIds'];
        const capabilityHeaders = ['id', 'name', 'section', 'currentProductId'];

        downloadCsvFile('vendors.csv', convertToCsv(vendors, vendorHeaders));
        downloadCsvFile('products.csv', convertToCsv(productsForCsv, productHeaders));
        downloadCsvFile('capabilities.csv', convertToCsv(capabilities, capabilityHeaders));

        console.log('Data download initiated for CSV files.');
        alert('Data downloads initiated. Please check your browser downloads. To persist changes on the hosted site, you will need to re-upload these files to Azure Blob Storage.');
    } catch (error) {
        console.error('Error saving data to CSV:', error);
        alert('Failed to initiate data downloads. Please try again.');
    }
}

/**
 * Loads data from CSV files or uses default data if CSVs are not found or empty.
 */
export async function loadDataFromCSV() {
    const defaultVendors = [
        { id: 'v1', name: 'AWS' },
        { id: 'v2', name: 'Microsoft' },
        { id: 'v3', name: 'Google' },
        { id: 'v4', name: 'IBM' },
        { id: 'v5', name: 'Pinecone' },
        { id: 'v6', name: 'Weaviate' },
        { id: 'v_cn', name: 'Cloud Native' }
    ];
    const defaultCapabilities = [
        { id: 'dataLake', name: 'Data Lake', section: 'infrastructure', currentProductId: null },
        { id: 'virtualisation', name: 'Virtualisation', section: 'infrastructure', currentProductId: null },
        { id: 'vectorDB', name: 'Vector DB', section: 'infrastructure', currentProductId: null },
        { id: 'storage', name: 'Storage', section: 'infrastructure', currentProductId: null },
        { id: 'aiOnboarding', name: 'AI Onboarding', section: 'aiPlatform', currentProductId: null },
        { id: 'aiTesting', name: 'AI Testing', section: 'aiPlatform', currentProductId: null },
        { id: 'aiIntegrations', name: 'AI Integrations', section: 'aiPlatform', currentProductId: null },
        { id: 'webUIs', name: 'WebUIs', section: 'aiPlatform', currentProductId: null },
        { id: 'developerEcosystem', name: 'Developer Ecosystem', section: 'aiPlatform', currentProductId: null },
        { id: 'aiCompliance', name: 'AI Compliance', section: 'aiPlatform', currentProductId: null },
        { id: 'aiGovernance', name: 'AI Governance', section: 'aiPlatform', currentProductId: null },
        { id: 'aiMonitoring', name: 'AI Monitoring', section: 'aiPlatform', currentProductId: null },
        { id: 'aiGateway', name: 'AI Gateway', section: 'aiPlatform', currentProductId: null },
        { id: 'aiSecurity', name: 'AI Security', section: 'aiPlatform', currentProductId: null },
        { id: 'modelManagementCustomization', name: 'Model Management + Customization', section: 'aiPlatform', currentProductId: null },
        { id: 'agenticEngines', name: 'Agentic Engines', section: 'aiPlatform', currentProductId: null },
        { id: 'aiDeployment', name: 'AI Deployment', section: 'aiPlatform', currentProductId: null },
        { id: 'aiHostingScalability', name: 'AI Hosting + Scalability', section: 'aiPlatform', currentProductId: null },
    ];
    const defaultProducts = [
        { id: 'p1', name: 'Amazon S3', vendorId: 'v1', capabilityIds: ['dataLake', 'storage'] },
        { id: 'p2', name: 'Azure ML', vendorId: 'v2', capabilityIds: ['aiOnboarding', 'aiTesting', 'aiDeployment', 'modelManagementCustomization', 'aiHostingScalability'] },
        { id: 'p3', name: 'Google AI Platform', vendorId: 'v3', capabilityIds: ['aiOnboarding', 'aiTesting', 'aiIntegrations', 'aiDeployment', 'aiHostingScalability', 'agenticEngines'] },
        { id: 'p4', name: 'IBM Watson', vendorId: 'v4', capabilityIds: ['aiOnboarding', 'aiIntegrations', 'webUIs', 'developerEcosystem', 'aiMonitoring', 'aiGateway'] },
        { id: 'p5', name: 'Amazon SageMaker', vendorId: 'v1', capabilityIds: ['aiOnboarding', 'aiTesting', 'aiDeployment', 'modelManagementCustomization', 'aiHostingScalability'] },
        { id: 'p6', name: 'Azure Data Lake Storage', vendorId: 'v2', capabilityIds: ['dataLake', 'storage'] },
        { id: 'p7', name: 'Google Cloud Storage', vendorId: 'v3', capabilityIds: ['dataLake', 'storage'] },
        { id: 'p8', name: 'Amazon EKS', vendorId: 'v1', capabilityIds: ['virtualisation', 'aiDeployment'] },
        { id: 'p9', name: 'Azure Kubernetes Service', vendorId: 'v2', capabilityIds: ['virtualisation', 'aiDeployment'] },
        { id: 'p10', name: 'Google Kubernetes Engine', vendorId: 'v3', capabilityIds: ['virtualisation', 'aiDeployment'] },
        { id: 'p11', name: 'Pinecone Vector DB', vendorId: 'v5', capabilityIds: ['vectorDB'] },
        { id: 'p12', name: 'Weaviate Cloud', vendorId: 'v6', capabilityIds: ['vectorDB'] },
        { id: 'p13', name: 'Azure AI Vision', vendorId: 'v2', capabilityIds: ['aiIntegrations'] },
        { id: 'p14', name: 'Google Cloud Vision AI', vendorId: 'v3', capabilityIds: ['aiIntegrations'] },
        { id: 'p15', name: 'AWS Lambda', vendorId: 'v1', capabilityIds: ['aiHostingScalability'] },
        { id: 'p16', name: 'Azure Functions', vendorId: 'v2', capabilityIds: ['aiHostingScalability'] },
        { id: 'p17', name: 'Google Cloud Functions', vendorId: 'v3', capabilityIds: ['aiHostingScalability'] },
        { id: 'p18', name: 'AWS AI Services', vendorId: 'v1', capabilityIds: ['webUIs', 'developerEcosystem', 'aiIntegrations'] },
        { id: 'p19', name: 'Azure AI Services', vendorId: 'v2', capabilityIds: ['webUIs', 'developerEcosystem', 'aiIntegrations'] },
        { id: 'p20', name: 'Google Cloud AI Services', vendorId: 'v3', capabilityIds: ['webUIs', 'developerEcosystem', 'aiIntegrations'] },
        { id: 'p_cn', name: 'Cloud Native Base Services', vendorId: 'v_cn', capabilityIds: defaultCapabilities.map(c => c.id) },
    ];

    try {
        const vendorsCSV = await fetch('data/vendors.csv').then(res => res.text()).then(parseCsv);
        const productsCSV = await fetch('data/products.csv').then(res => res.text()).then(parseCsv);
        const capabilitiesCSV = await fetch('data/capabilities.csv').then(res => res.text()).then(parseCsv);

        setVendors(vendorsCSV.length > 0 ? vendorsCSV : defaultVendors);
        setProducts(productsCSV.length > 0 ? productsCSV.map(p => ({ ...p, capabilityIds: p.capabilityIds ? p.capabilityIds.split(',') : [] })) : defaultProducts);
        setCapabilities(capabilitiesCSV.length > 0 ? capabilitiesCSV.map(c => ({ ...c, currentProductId: c.currentProductId || null })) : defaultCapabilities);

        // Ensure all default capabilities are present if any CSV was loaded but missed some
        defaultCapabilities.forEach(dc => {
            if (!capabilities.some(c => c.id === dc.id)) {
                capabilities.push(dc);
            }
        });
        // Ensure all default vendors are present
        defaultVendors.forEach(dv => {
            if (!vendors.some(v => v.id === dv.id)) {
                vendors.push(dv);
            }
        });
        // Add any missing vendors from products (e.g., if Pinecone/Weaviate were only in comments)
        defaultProducts.forEach(dp => {
            if (dp.vendorId && !vendors.some(v => v.id === dp.vendorId)) {
                vendors.push({ id: dp.vendorId, name: `Vendor ${dp.vendorId}` });
            }
        });

        console.log('Data loaded from CSVs.');
    } catch (error) {
        console.warn('Failed to load data from CSVs, using default data:', error);
        setVendors(defaultVendors);
        setProducts(defaultProducts);
        setCapabilities(defaultCapabilities);
    }
}