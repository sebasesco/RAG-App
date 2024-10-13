"use client";

import { QueryModel } from "@/api-client";
import createApiClient from "@/lib/getApiClient";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// This is your main page component
export function ViewQueryPage() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("query_id");
  const api = createApiClient();
  const [queryItem, setQueryItem] = useState<QueryModel>();

  // Fetch data from the API.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = {
          queryId: queryId!,
        };
        const response = api.getQueryEndpointGetQueryGet(request);
        response.then((data) => {
          console.log(data);
          setQueryItem(data);
        });
        console.log(`Got data: ${response}`);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [queryId]);

  let viewQueryElement;

  if (!queryItem) {
    viewQueryElement = (
      <div className="space-y-4">
        <div className="h-24 w-full bg-gray-300 rounded animate-pulse"></div>
        <div className="h-24 w-full bg-gray-300 rounded animate-pulse"></div>
      </div>
    );
  } else {
    const sourcesElement = queryItem.sources?.length ? (
      queryItem.sources.map((source: string) => (
        <a
          key={source}
          href={`/source/${source}`}
          className="text-xs text-blue-500 hover:underline truncate block"
          style={{ maxWidth: '100%' }}
        >
          {source}
        </a>
      ))
    ) : (
      <p>No sources available.</p>
    );

    const answerElement = queryItem.isComplete ? (
      <>
        <div className="font-bold">Response</div>
        <div>{queryItem?.answerText || "Query still in progress. Please wait..."}</div>
        <div className="mt-4">{sourcesElement}</div>
      </>
    ) : (
      <div className="text-gray-500 flex">
        <div className="loader mr-2 my-auto" /> Still loading. Please try again later.
      </div>
    );

    viewQueryElement = (
      <>
        <div className="bg-blue-100 text-blue-900 p-4 rounded">
          <div className="font-bold">Question</div>
          <p>{queryItem?.queryText}</p>
        </div>
        <div className="bg-gray-100 text-gray-700 p-4 rounded mt-4">
          {answerElement}
        </div>
      </>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-lg p-6 shadow-md">
        <h1 className="text-xl font-bold text-center mb-4">View Query</h1>
        <p className="text-gray-600">Query ID: {queryId}</p>
        <div className="mt-6">{viewQueryElement}</div>
        <div className="mt-6 text-left">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-bold">
            &#8592; Back
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewQueryPage />
    </Suspense>
  );
}