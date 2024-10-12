import { v4 as uuidv4 } from "uuid";

export function getSessionId() {
    // This check ensures that the function only runs on the client-side (browser)
    if (typeof window === "undefined") {
        return "User"; // If running on the server, return a fallback like "User"
    }

    // Check if sessionId is already stored in sessionStorage
    let sessionId = sessionStorage.getItem("sessionId");

    // If no sessionId exists, generate a new one and store it in sessionStorage
    if (!sessionId) {
        sessionId = uuidv4(); // Generate a new UUID for the session
        sessionStorage.setItem("sessionId", sessionId); // Save the sessionId in sessionStorage
    }

    // Return the sessionId (either retrieved or newly generated)
    return sessionId;
}