"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { QueryModel } from "@/api-client";
import createApiClient from "@/lib/getApiClient";

// Component that uses useSearchParams to fetch query data
function ViewQuery() {
  const searchParams = useSearchParams(); // Client-side hook to get URL params
  const queryId = searchParams.get("query_id"); // Extract query_id from URL
  const api = createApiClient(); // Create an API client instance
  const [queryItem, setQueryItem] = useState<QueryModel | null>(null); // State to store fetched query data

  // useEffect to fetch the query data when the component mounts or queryId changes
  useEffect(() => {
    const fetchData = async () => {
      if (queryId) {
        const request = { queryId }; // Construct the request payload with queryId
        const response = await api.getQueryEndpointGetQueryGet(request); // Fetch query data from the API
        setQueryItem(response); // Set the response data in state
      }
    };
    fetchData();
  }, [queryId, api]);

  // Loading state (renders skeletons while fetching data)
  if (!queryItem) {
    return (
      <div className="space-y-4">
        <div className="h-24 w-full bg-gray-300 rounded animate-pulse"></div>
        <div className="h-24 w-full bg-gray-300 rounded animate-pulse"></div>
      </div>
    );
  }

  // Display the query data once it's fetched
  return (
    <>
      <div className="bg-blue-100 text-blue-900 p-4 rounded">
        <div className="font-bold">Question</div>
        <p>{queryItem.queryText}</p>
      </div>
      <div className="bg-gray-100 text-gray-700 p-4 rounded mt-4">
        <div className="font-bold">Response</div>
        <p>{queryItem.answerText || "Query still in progress. Please wait..."}</p>
        <div className="mt-4">
          {queryItem.sources?.length ? (
            queryItem.sources.map((source, idx) => (
              <a
                key={idx}
                href={`/source/${source}`}
                className="text-xs text-blue-500 hover:underline truncate block"
                style={{ maxWidth: "100%" }}
              >
                {source}
              </a>
            ))
          ) : (
            <p>No sources available.</p>
          )}
        </div>
      </div>
    </>
  );
}

// Main component that wraps ViewQuery with Suspense
export default function ViewQueryPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-lg p-6 shadow-md">
        <h1 className="text-xl font-bold text-center mb-4">View Query</h1>
        <Suspense fallback={<div>Loading Query...</div>}>
          <ViewQuery /> {/* Wrapping the component that fetches data */}
        </Suspense>
        <div className="mt-6 text-left">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-bold">
            &#8592; Back
          </a>
        </div>
      </div>
    </div>
  );
}