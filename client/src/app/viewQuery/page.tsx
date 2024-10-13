"use client";

import { QueryModel } from "@/api-client";
import createApiClient from "@/lib/getApiClient";
import { useSearchParams } from "next/navigation";
import { useEffect, useState  } from "react";

export default function ViewQueryPage() {
  const searchParams = useSearchParams(); //Get query parameters from the URL
  const queryId = searchParams.get("query_id"); //Extract query_id from the URL parameters
  const api = createApiClient(); //Create an API client instance
  const [queryItem, setQueryItem] = useState<QueryModel | null>(null); //State to store fetched query data
  const [error, setError] = useState<string | null>(null); //State to store any error messages

  //useEffect to fetch the query data when the component mounts or queryId changes
  useEffect(() => {
    //Check if queryId is missing
    if (!queryId) {
      setError("Query ID is missing from the URL.");
      return;
    }

    //Async function to fetch data from the API
    const fetchData = async () => {
      try {
        const request = { queryId: queryId! }; //Construct the request payload with queryId
        const response = await api.getQueryEndpointGetQueryGet(request); //Fetch query data from the API
        setQueryItem(response); //Set the response data in state
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load query data. Please try again.");
      }
    };

    fetchData();
  }, [queryId]);

  // Decide what to render based on the state
  let viewQueryElement;

  //Render error message if an error occurs
  if (error) {
    viewQueryElement = (
      <div className="text-red-600">
        <p>{error}</p>
      </div>
    );
  }
  //Render skeleton loading state while the query data is being fetched
  else if (!queryItem) {
    viewQueryElement = (
      <div className="space-y-4">
        <div className="h-24 w-full bg-gray-300 rounded animate-pulse"></div>
        <div className="h-24 w-full bg-gray-300 rounded animate-pulse"></div>
      </div>
    );
  }
  //Render the actual query data once it has been fetched
  else {
    //Render sources associated with the query
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
      <p>No sources available for this query.</p>
    );

    //Render the answer to the query if it is complete
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

    //Display the question, answer, and sources
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
        {queryId ? <p className="text-gray-600">Query ID: {queryId}</p> : null}
        <div className="mt-6">{viewQueryElement}</div>
        <div className="mt-6 text-left">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 font-bold"
          >
            &#8592; Back
          </a>
        </div>
      </div>
    </div>
  );
}