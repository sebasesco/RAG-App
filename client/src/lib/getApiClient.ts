"use-client";

import { Configuration, DefaultApi } from "@/api-client";

// Function to get the API base URL from environment variables, with a fallback
export function getApiUrl() {
    return "https://lgzz4srm5gimo3invvmtgykami0pcxpy.lambda-url.us-west-2.on.aws";
}

// Function to create and return an API client instance
export default function createApiClient() {
    const apiConfig = new Configuration({
        basePath: getApiUrl(), // Set the basePath for the API client
    });
    
    // Create a new API client instance with the configuration
    const api = new DefaultApi(apiConfig);
    
    return api;
}