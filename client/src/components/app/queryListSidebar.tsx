"use client";

import { QueryModel } from "@/api-client";
import createApiClient from "@/lib/getApiClient";
import { useEffect, useState } from "react";
import QueryListItem from "./queryListItem";
import { getSessionId } from "@/lib/getUserId";

export default function QueryListSidebar() {
  const api = createApiClient(); //Creating an API client instance
  const userId = getSessionId(); //Fetching the session ID for the current user

  const [isLoading, setIsLoading] = useState(true); //State to track if the data is loading
  const [queryItems, setQueryItems] = useState<QueryModel[]>([]); //State to hold the list of queries

  //useEffect to fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = { userId: userId }; //Preparing the request with the user ID
        const response = api.listQueryEndpointListQueryGet(request); //Sending a request to fetch queries
        response.then((data) => {
          setQueryItems(data); // Updating the state with the fetched queries
          setIsLoading(false); // Setting isLoading to false once data is fetched
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userId]);

  // Conditional rendering: Display a loading skeleton while fetching data
  let queryElements;
  if (isLoading) {
    queryElements = (
      <div className="space-y-2 p-4">
        <div className="animate-pulse bg-gray-300 h-6 w-full rounded-md"></div>
        <div className="animate-pulse bg-gray-300 h-6 w-full rounded-md"></div>
        <div className="animate-pulse bg-gray-300 h-6 w-full rounded-md"></div>
      </div>
    );
  } else {
    // Map over the fetched query items and render each one using QueryListItem component
    queryElements = queryItems.map((queryItem) => {
      return <QueryListItem key={queryItem.queryId} {...queryItem} />;
    });
  }

  return (
    <div className="w-64 h-full fixed top-0 left-0 bg-white border-r border-gray-200 shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-lg text-center">Recent Queries</h1>
      </div>
      
      <div className="p-4 overflow-y-auto h-full">
        {queryElements}
      </div>
    </div>
  );
}